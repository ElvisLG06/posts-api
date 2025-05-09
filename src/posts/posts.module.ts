import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsSchema, Posts } from '../schemas/posts.schema';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: Posts.name, 
        schema: PostsSchema 
      },
    ]),
    AuthModule,
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
