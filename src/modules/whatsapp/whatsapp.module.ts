import { Module } from '@nestjs/common';
import { WhatsappController } from './controllers/whatsapp.controller';
import { WhatsappService } from './services/whatsapp.service';
import { WppService } from './services/wpp.service';

@Module({  
  controllers: [WhatsappController],
  providers: [WhatsappService, WppService],
})
export class WhatsappModule {}
