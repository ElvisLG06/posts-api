import { Controller, Get, Post, Delete, Put, Body, Param, ConflictException, NotFoundException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from 'src/dto/create-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) { }

    @Get()
    findAll() {
        return this.postsService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        const post = await this.postsService.findOne(id);
        if (!post) {
            throw new NotFoundException("Post not found");
        }
        return post;
    }

    @Post()
    async create(@Body() body: CreatePostDto) {
        try {
            return await this.postsService.create(body);
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException("Post already exists");
            }
            throw error;
        }
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        const post = await this.postsService.delete(id);
        if (!post) {
            throw new NotFoundException("Post not found");
        }
        return post;
    }

    @Put(":id")
    async update(@Param("id") id: string, @Body() body: never) {
        const post = await this.postsService.update(id, body); 
        if (!post) {
            throw new NotFoundException("Post not found");
        }
        return post;
    }


}

