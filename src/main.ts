import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {  
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3003);
}
bootstrap();
