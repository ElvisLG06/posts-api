import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core'; 

import { PostsModule } from './posts/posts.module';
import { ProfileInterceptor } from './common/profile.interceptor'; // Importar el interceptor
import { S3Service } from './common/s3.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ?? 'mongodb://localhost:27017/postsdb'
    ),
    PostsModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ProfileInterceptor, // Registrar el interceptor globalmente
    },
    S3Service, 
  ],
})
export class AppModule { }
