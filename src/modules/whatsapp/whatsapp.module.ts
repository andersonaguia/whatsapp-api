import { Module } from '@nestjs/common';
import { WhatsappController } from './controllers/whatsapp.controller';
import { WhatsappService } from './services/whatsapp.service';

@Module({
  controllers: [WhatsappController],
  providers: [WhatsappService]
})
export class WhatsappModule {}
