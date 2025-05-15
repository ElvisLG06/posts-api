import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsSchema, Posts } from '../schemas/posts.schema';
import { S3Service } from '../common/s3.service'; // Ajusta la ruta según donde esté el servicio



@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: Posts.name, 
        schema: PostsSchema 
      },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, S3Service]
})
export class PostsModule {}
