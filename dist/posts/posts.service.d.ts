import { Posts } from '../schemas/posts.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
export declare class PostsService {
    private postsModel;
    constructor(postsModel: Model<Posts>);
    findAll(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, Posts, {}> & Posts & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[], import("mongoose").Document<unknown, {}, Posts, {}> & Posts & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, Posts, "find", {}>;
    create(createPosts: CreatePostDto): Promise<import("mongoose").Document<unknown, {}, Posts, {}> & Posts & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findOne(id: string): Promise<(import("mongoose").Document<unknown, {}, Posts, {}> & Posts & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    delete(id: string): Promise<(import("mongoose").Document<unknown, {}, Posts, {}> & Posts & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    update(id: string, posts: UpdatePostDto): Promise<(import("mongoose").Document<unknown, {}, Posts, {}> & Posts & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
}
