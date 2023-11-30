import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { whatsappConnection } from './core/connection/connection';

async function bootstrap() {  
  //await whatsappConnection();
  const app = await NestFactory.create(AppModule);
  await app.listen(3003);
}
bootstrap();
