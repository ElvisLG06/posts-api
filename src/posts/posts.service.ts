import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts } from '../schemas/posts.schema';
import { Model, FilterQuery } from 'mongoose';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostsQueryDto } from '../dto/posts-query.dto';
import { S3Service } from '../common/s3.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Posts.name) private postsModel: Model<Posts>,
        private s3Service: S3Service,
    ) { }

    async findAllForUser(profileId: string) {
        // 1) Traer todos los posts como objetos planos
        const posts = await this.postsModel.find().lean().exec();

        // 2) Mapearlos aplicando la lógica de anonimato
        return posts.map(post => ({
            ...post,
            seller_id:
                post.is_anonymous && post.seller_id !== profileId
                    ? 'anonymous'
                    : post.seller_id,
        }));
    }



    async create(createPostDto: CreatePostDto, profileId: string, images: Express.Multer.File[]) {
        // 1. Subir imágenes a S3 y obtener URLs
        const uploadedUrls = await Promise.all(
            images.map((file, idx) => this.s3Service.uploadFile(file, `${profileId}-${idx}`))
        );

        // 2. Crear el post con las URLs de las imágenes y seller_id forzado
        const newPost = new this.postsModel({
            ...createPostDto,
            seller_id: profileId,
            images: uploadedUrls,
            stars_amount: 0,
            ratings_count: 0,
        });

        // 3. Guardar en MongoDB
        return newPost.save();
    }





    async findOne(id: string) {
        return this.postsModel.findById(id);
    }

    async markAsDeleted(id: string) {
        // 1) Asegurarnos de que existe
        const post = await this.postsModel.findById(id);
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        // 2) Actualizar solo el campo is_deleted
        post.is_deleted = true;
        return post.save();   // devuelve el documento con is_deleted: true
    }





    // Método update adaptado
    async update(
        id: string,
        updatePostDto: UpdatePostDto,
        profileId: string,
        images: Express.Multer.File[],
    ) {
        const post = await this.postsModel.findById(id);
        if (!post) throw new NotFoundException('Post not found');
        if (post.seller_id !== profileId) throw new ForbiddenException('No permission to update this post');

        // Si hay imágenes nuevas, eliminar las viejas de S3 y subir las nuevas
        let uploadedUrls = post.images; // si no hay nuevas, mantener las viejas

        if (images && images.length > 0) {
            // Eliminar imágenes viejas de S3
            await Promise.all(post.images.map(url => this.s3Service.deleteFile(url)));

            // Subir nuevas imágenes a S3
            uploadedUrls = await Promise.all(
                images.map((file, idx) => this.s3Service.uploadFile(file, `${profileId}-${idx}`))
            );
        }

        // Actualizar el post con los nuevos datos y las URLs nuevas
        Object.assign(post, updatePostDto, { images: uploadedUrls });
        return post.save();
    }





    async markAsUndeleted(id: string) {
        // 1) Asegurar que el post existe
        const post = await this.postsModel.findById(id);
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        // 2) Marcar como no eliminado
        post.is_deleted = false;
        return post.save();  // devuelve el documento con is_deleted: false
    }

    async markAsArchived(id: string) {
        // 1) Verificar existencia
        const post = await this.postsModel.findById(id);
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        // 2) Cambiar a archivado
        post.is_archived = true;
        return post.save();
    }

    async markAsUnarchived(id: string) {
        const post = await this.postsModel.findById(id);
        if (!post) throw new NotFoundException('Post not found');

        post.is_archived = false;
        return post.save();
    }

    async markAsAnonymous(id: string) {
        const post = await this.postsModel.findById(id);
        if (!post) throw new NotFoundException('Post not found');

        post.is_anonymous = true;
        return post.save();
    }

    /** Revierte el anonimato (lo hace público) */
    async markAsUnanonymous(id: string) {
        const post = await this.postsModel.findById(id);
        if (!post) throw new NotFoundException('Post not found');

        post.is_anonymous = false;
        return post.save();
    }

    async findAllByOwner(profileId: string) {
        // Usa lean() para devolver objetos planos si no necesitas métodos de Mongoose
        return this.postsModel
            .find({ seller_id: profileId })
            .lean()
            .exec();
    }

    async findPublicByProfile(profileId: string) {
        return this.postsModel
            .find({ seller_id: profileId, is_anonymous: false })
            .lean()
            .exec();
    }

    async findWithFilters(query: PostsQueryDto, ownerId: string) {
        const {
            priceMin, priceMax, tag, nameContains,
            page = 1, limit = 10,
        } = query;

        const filter: FilterQuery<Posts> = { is_deleted: false };

        if (priceMin != null || priceMax != null) {
            filter.price = {};
            if (priceMin != null) filter.price.$gte = priceMin;
            if (priceMax != null) filter.price.$lte = priceMax;
        }
        if (tag) filter.tags = tag;
        if (nameContains) filter.title = { $regex: nameContains, $options: 'i' };

        const total = await this.postsModel.countDocuments(filter);
        const skip = (page - 1) * limit;

        const docs = await this.postsModel
            .find(filter)
            .skip(skip)
            .limit(limit)
            .lean()
            .exec();

        const data = docs.map(post => ({
            ...post,
            seller_id:
                post.is_anonymous && post.seller_id !== ownerId
                    ? 'anonymous'
                    : post.seller_id,
        }));

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async ratePost(id: string, rating: number, raterId: string) {
        const post = await this.postsModel.findById(id);
        if (!post) throw new NotFoundException('Post not found');

        // Impedir que el autor se valore a sí mismo
        if (post.seller_id === raterId) {
            throw new ForbiddenException('The creator of the post cannot rate it');
        }

        // Fórmula de promedio incremental
        const totalPrevio = post.stars_amount * post.ratings_count;
        const nuevoCount = post.ratings_count + 1;
        const nuevoPromedio = (totalPrevio + rating) / nuevoCount;

        post.stars_amount = nuevoPromedio;
        post.ratings_count = nuevoCount;
        return post.save();
    }






}
