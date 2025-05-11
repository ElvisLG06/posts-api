import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Post Microservice API')
    .setDescription('Esta API permite la gestión de posts en una plataforma, donde los usuarios pueden crear, consultar, actualizar, eliminar (de forma lógica), archivar y calificar sus publicaciones. Además, soporta la gestión de privacidad mediante la opción de hacer un post anónimo o público.')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', in: 'header', name: 'X-Profile-ID' }, // Aquí estamos agregando el header X-Profile-ID
      'profileId', // Nombre del parámetro
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger en /api


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
