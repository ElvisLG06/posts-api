import { IsArray, IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdatePostDto {

    @IsOptional()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsArray()
    tags?: string[];

    @IsOptional()
    @IsNumber()
    price?: number;	

    @IsOptional()
    @IsString()
    presentation_card_id?: string;

    @IsOptional()
    @IsArray()
    images?: string[];


}
    