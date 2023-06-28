import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { whatsappConnection } from './connection/connection';

async function bootstrap() {  
  await whatsappConnection();
  const app = await NestFactory.create(AppModule);
  await app.listen(3003);
}
bootstrap();
