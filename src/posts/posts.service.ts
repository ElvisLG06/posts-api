import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts } from '../schemas/posts.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

type CreatePostWithSeller = CreatePostDto & { seller_id: string };

@Injectable()
export class PostsService {
    constructor(@InjectModel(Posts.name) private postsModel: Model<Posts>) { }

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

    async create(createPosts: CreatePostWithSeller) {
        const newPosts = new this.postsModel(createPosts);
        return newPosts.save()
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

    async update(id: string, posts: UpdatePostDto) {
        return this.postsModel.findByIdAndUpdate(id, posts, { new: true });
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






}
