import { IsArray, IsNotEmpty, IsNumber, IsString, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {

    @ApiProperty({ description: 'Título del post' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Descripción del post' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'Etiquetas asociadas al post' })
    @IsArray()
    tags: string[];

    @ApiProperty({ description: 'Precio del post' })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    price: number;	

    @ApiProperty({ description: 'ID de la tarjeta de presentación' })
    @IsString()
    @IsNotEmpty()
    presentation_card_id: string;

    @ApiProperty({ description: 'Anonimato del post' })
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    is_anonymous?: boolean;

}
    