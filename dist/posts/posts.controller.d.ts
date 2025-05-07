import { PostsService } from './posts.service';
import { CreatePostDto } from 'src/dto/create-post.dto';
export declare class PostsController {
    private postsService;
    constructor(postsService: PostsService);
    findAll(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("../schemas/posts.schema").Posts, {}> & import("../schemas/posts.schema").Posts & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[], import("mongoose").Document<unknown, {}, import("../schemas/posts.schema").Posts, {}> & import("../schemas/posts.schema").Posts & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, import("../schemas/posts.schema").Posts, "find", {}>;
    findOne(id: string): Promise<import("../schemas/posts.schema").Posts & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    create(body: CreatePostDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/posts.schema").Posts, {}> & import("../schemas/posts.schema").Posts & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    delete(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/posts.schema").Posts, {}> & import("../schemas/posts.schema").Posts & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    update(id: string, body: never): Promise<import("mongoose").Document<unknown, {}, import("../schemas/posts.schema").Posts, {}> & import("../schemas/posts.schema").Posts & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
