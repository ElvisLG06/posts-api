import { IsArray, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {

    @ApiProperty()
    @IsOptional()
    title?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    tags?: string[];

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    price?: number;	

    @ApiProperty()
    @IsOptional()
    @IsString()
    presentation_card_id?: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    images?: string[];


}
    