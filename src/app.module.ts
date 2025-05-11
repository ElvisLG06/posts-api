import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileInterceptor } from './common/profile.interceptor'; // Importar el interceptor
import { APP_INTERCEPTOR } from '@nestjs/core'; 

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
  ],
})
export class AppModule { }
