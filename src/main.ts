import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
   );
 // const app = await NestFactory.create(AppModule);
 const options = new DocumentBuilder()
    .setTitle('Rest Endpoints')
    .setDescription('Rest API descriptions')
    .setVersion('1.0')
    .addTag('Rest')
    .build();
  // const document = SwaggerModule.createDocument(app, options);
  // SwaggerModule.setup('swagger', app, document);
  
  app.enableCors({origin: true});
  const port = process.env.PORT || 3000;
  await app.listen(port,'0.0.0.0');
}

bootstrap();