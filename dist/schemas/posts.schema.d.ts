export declare class Posts {
    title: string;
    description: string;
    tags: Array<string>;
    price: number;
    presentation_card_id: string;
    images: Array<string>;
    is_archived: boolean;
    is_deleted: boolean;
    is_anonymous: boolean;
    seller_id: string;
    stars_amount: number;
}
export declare const PostsSchema: import("mongoose").Schema<Posts, import("mongoose").Model<Posts, any, any, any, import("mongoose").Document<unknown, any, Posts, any> & Posts & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Posts, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Posts>, {}> & import("mongoose").FlatRecord<Posts> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
