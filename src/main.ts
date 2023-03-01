import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { GlobalExceptionFilter } from './common/exception/global-exception.filter';
import { ValidationError } from 'class-validator';
import { ValidationException } from './common/exception/validation-exception';
import { GlobalResponseInterceptor } from './common/interceptors/global-response-interceptor.service';
import { ConfigService } from '@nestjs/config';
import {swagger} from "./swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.setGlobalPrefix('api');

  if (config.get('ENVIRONMENT') !== 'production'){
      swagger(app);
  }

  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
          return new ValidationException(validationErrors);
        },
      }),
  );
  app.useGlobalInterceptors(new GlobalResponseInterceptor());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapter));
  app.use(helmet());
  const port = config.get('PORT');
  await app.listen(port || 3000);
}
bootstrap();
