import { Module } from '@nestjs/common';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [WhatsappModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
