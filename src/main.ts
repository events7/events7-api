import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Set up OpenAPI Swagger
  const config = new DocumentBuilder()
    .setTitle(process.env.API_TITLE ?? 'Events7 API')
    .setDescription(
      process.env.API_DESCRIPTION ?? 'The Events7 API description',
    )
    .setVersion(process.env.API_VERSION ?? '2.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  // Enable versioning into URI
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  // Trust proxy
  app.set('trust proxy', 'loopback');

  // Start listening
  await app.listen(process.env.PORT ?? 3000);
}

// NOTE: Disable `no-floating-promises` rule - we
// NOTE: want it to fail on unhandled rejections
// NOTE: from `bootstrap`
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
