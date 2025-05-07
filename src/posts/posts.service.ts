import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts } from '../schemas/posts.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsService {
    constructor(@InjectModel(Posts.name) private postsModel: Model<Posts>) { }

    findAll() {
        return this.postsModel.find();
    }

    async create(createPosts: CreatePostDto) {
        const newPosts = new this.postsModel(createPosts);
        return newPosts.save()
    }

    async findOne(id: string) {
        return this.postsModel.findById(id);
    }

    async delete(id: string) {
        return this.postsModel.findByIdAndDelete(id);
    }

    async update(id: string, posts: UpdatePostDto) {
        return this.postsModel.findByIdAndUpdate(id, posts, { new: true });
    }
}
