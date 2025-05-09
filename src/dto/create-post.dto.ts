import { IsArray, IsNotEmpty, IsNumber, IsString, IsBoolean } from 'class-validator';

export class CreatePostDto {

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

    @IsBoolean()
    is_anonymous?: boolean;

}
    