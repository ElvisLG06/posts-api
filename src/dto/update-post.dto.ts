import { IsArray, IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
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
    @IsString({ each: true })
    tags?: string[];

    @ApiProperty()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    price?: number;	

    @ApiProperty()
    @IsOptional()
    @IsString()
    presentation_card_id?: string;


}
    