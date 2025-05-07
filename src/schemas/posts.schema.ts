import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    timestamps: true,
})
export class Posts {

    @Prop({
        trim: true,
        required: true,
    })
    title: string; // titulo del post

    @Prop({
        required: true,
    })
    description: string; // descripcion del post


    @Prop({
    })
    tags: Array<string>; // array de strings

    @Prop({
        required: true,
        trim: true,
    })
    price: number; // precio del post

    @Prop({
        required: true,
    })
    presentation_card_id: string; // por ahora, pq no tengo el id de la tarjeta de presentacion, lo dejo como string

    @Prop({
        required: true,
    })
    images: Array<string>; // array de strings, por ahora solo se puede subir una imagen, pero en el futuro se podran subir varias y se limitara en el api 

    @Prop({
        required: true,
        default: false, // por defecto es false
    })
    is_archived: boolean; // si el post esta archivado o no

    @Prop({
        required: true,
        default: false, 
    })
    is_deleted: boolean; // si el post esta eliminado o no

    @Prop({
        required: true,
        default: false, // por defecto es false
    })
    is_anonymous: boolean; // si el post es anonimo o no

    @Prop({
        required: true,
    })
    seller_id: number; // id del vendedor

    @Prop({
        min: 0,
        max: 5,
    })
    stars_amount: number; // cantidad de estrellas que tiene el post
}

export const PostsSchema = SchemaFactory.createForClass(Posts)