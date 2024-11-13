import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { Logger } from '@nestjs/common';
import { ValidationException } from './common/exceptions/validation.exception';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) =>
          Object.values(error.constraints).join(', '),
        );
        return new ValidationException(messages.join('; '));
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
  logger.log('Application is running on: http://localhost:3000');
}
bootstrap();
