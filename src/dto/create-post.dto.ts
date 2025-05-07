import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {

    @IsNotEmpty()
    @IsNumber()
    seller_id: number; 

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    tags: string[];

    @IsNotEmpty()
    @IsNumber()
    price: number;	

    @IsString()
    @IsNotEmpty()
    presentation_card_id: string;

    @IsNotEmpty()
    @IsArray()
    images: string[];

}
    