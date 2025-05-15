import { Controller, Get, Post, Patch, Put, Body, Param, ConflictException, NotFoundException, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from 'src/dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Request, ForbiddenException, Query, BadRequestException } from '@nestjs/common';
import { PostsQueryDto } from '../dto/posts-query.dto';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('posts') // Categoriza los endpoints

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) { }

    @ApiOperation({ summary: 'Obtiene los posts del usuario actual' })
    @Get('me')
    async findMine(@Request() req) {
        // req.user.profileId proviene de JwtStrategy.validate()
        return this.postsService.findAllByOwner(req.user.profileId);
    }

    @ApiOperation({ summary: 'Obtiene los posts públicos de un perfil por su ID' })
    @Get('profile/:profileId')
    async findPublicByProfile(
        @Param('profileId') profileId: string
    ) {
        return this.postsService.findPublicByProfile(profileId);
    }

    @ApiOperation({ summary: 'Obtiene todos los posts con filtros' })
    @Get()
    async findAll(
        @Request() req,
        @Query() query: PostsQueryDto,
    ) {
        return this.postsService.findWithFilters(query, req.user.profileId);
    }


    @ApiOperation({ summary: 'Obtiene un post por su ID' })
    @Get(':id')
    async findOne(
        @Param('id') id: string,
        @Request() req
    ) {
        const post = await this.postsService.findOne(id);
        if (!post) throw new NotFoundException();

        const result = post.toObject ? post.toObject() : { ...post };

        if (result.is_anonymous && req.user.profileId !== result.seller_id) {
            result.seller_id = 'anonymous';
        }
        return result;
    }

    @ApiOperation({ summary: 'Crea un nuevo post' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } },
                price: { type: 'number' },
                presentation_card_id: { type: 'string' },
                images: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                },
            },
        },
    })
    @UseInterceptors(FilesInterceptor('images'))
    @Post()
    async create(
        @UploadedFiles() images: Express.Multer.File[],
        @Body() body: CreatePostDto,
        @Request() req) {
        try {
            return await this.postsService.create(body, req.user.profileId, images);
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException("Post already exists");
            }
            throw error;
        }
    }

    @ApiOperation({ summary: 'Elimina un post de forma lógica' })
    @Patch('delete/:id')
    async softDelete(
        @Param('id') id: string,
        @Request() req
    ) {
        // 1) Buscar el post
        const post = await this.postsService.findOne(id);
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        // 2) Verificar que quien llama es el autor
        if (post.seller_id !== req.user.profileId) {
            throw new ForbiddenException('You do not have permission to delete this post.');
        }

        // 3) Revisar si ya estaba eliminado
        if (post.is_deleted) {
            return { message: 'This post is already deleted' };
        }

        // 4) Marcar como eliminado
        return this.postsService.markAsDeleted(id);
    }

    @ApiOperation({ summary: 'Restaura un post eliminado de forma lógica' })
    @Patch('undelete/:id')
    async undelete(
        @Param('id') id: string,
        @Request() req
    ) {
        // 1) Primero, buscar el post
        const post = await this.postsService.findOne(id);
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        // 2) Verificar que el requester es el autor
        if (post.seller_id !== req.user.profileId) {
            throw new ForbiddenException('You do not have permission to undelete this post.');
        }

        // 3) Si ya no estaba marcado como eliminado
        if (!post.is_deleted) {
            return { message: 'This post is undeleted' };
        }

        // 4) Llamar al servicio para revertir el borrado lógico
        return this.postsService.markAsUndeleted(id);
    }


    @ApiOperation({ summary: 'Actualiza un post por su ID' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FilesInterceptor('images'))
    @Put(':id')
    async update(
        @Param('id') id: string,
        @UploadedFiles() images: Express.Multer.File[],
        @Body() body: UpdatePostDto,
        @Request() req
    ) {
        // 1) Verificar que el post existe
        const post = await this.postsService.findOne(id);
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        // 2) Sólo el autor puede actualizar
        if (post.seller_id !== req.user.profileId) {
            throw new ForbiddenException('You do not have permission to update this post.');
        }

        // 3) Ejecutar la actualización
        const updated = await this.postsService.update(id, body, req.user.profileId, images);
        return updated;
    }

    @ApiOperation({ summary: 'Archiva un post' })
    @Patch('archive/:id')
    async archive(
        @Param('id') id: string,
        @Request() req
    ) {
        // 1) Buscar el post
        const post = await this.postsService.findOne(id);
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        // 2) Verificar que quien llama es el autor
        if (post.seller_id !== req.user.profileId) {
            throw new ForbiddenException('You do not have permission to archive this post.');
        }

        // 3) Si ya estaba archivado
        if (post.is_archived) {
            return { message: 'This post is already archived' };
        }

        // 4) Marcar como archivado
        return this.postsService.markAsArchived(id);
    }

    @ApiOperation({ summary: 'Desarchiva un post' })
    @Patch('unarchive/:id')
    async unarchive(
        @Param('id') id: string,
        @Request() req,
    ) {
        const post = await this.postsService.findOne(id);
        if (!post) throw new NotFoundException('Post not found');

        if (post.seller_id !== req.user.profileId) {
            throw new ForbiddenException('You do not have permission to unarchive this post.');
        }

        if (!post.is_archived) {
            return { message: 'This post is unarchived' };
        }

        return this.postsService.markAsUnarchived(id);
    }

    @ApiOperation({ summary: 'Hace un post anónimo' })
    @Patch('anonymous/:id')
    async makeAnonymous(
        @Param('id') id: string,
        @Request() req,
    ) {
        const post = await this.postsService.findOne(id);
        if (!post) throw new NotFoundException('Post not found');

        if (post.seller_id !== req.user.profileId) {
            throw new ForbiddenException('You do not have permission to anonymous this post.');
        }

        if (post.is_anonymous) {
            return { message: 'This post is already anonymous' };
        }

        return this.postsService.markAsAnonymous(id);
    }

    @ApiOperation({ summary: 'Hace público un post anónimo' })
    @Patch('unanonymous/:id')
    async makePublic(
        @Param('id') id: string,
        @Request() req,
    ) {
        const post = await this.postsService.findOne(id);
        if (!post) throw new NotFoundException('Post not found');

        if (post.seller_id !== req.user.profileId) {
            throw new ForbiddenException('You do not have permission to unanonymous this post.');
        }

        if (!post.is_anonymous) {
            return { message: 'This post is already not anonymous' };
        }

        return this.postsService.markAsUnanonymous(id);
    }

    @ApiOperation({ summary: 'Califica un post' })
    @Patch('rate/:id')
    async rate(
        @Param('id') id: string,
        @Body('rating') rating: number,
        @Request() req
    ) {
        // Validar rango
        if (rating < 0 || rating > 5) {
            throw new BadRequestException('Rating debe estar entre 0 y 5');
        }

        // Delega en el servicio (que también impide autoría)
        return this.postsService.ratePost(id, rating, req.user.profileId);
    }









}

