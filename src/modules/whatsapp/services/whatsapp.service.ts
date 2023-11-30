import { Injectable } from '@nestjs/common';
import { CreateWhatsappDto } from '../dto/create-whatsapp.dto';
import { UpdateWhatsappDto } from '../dto/update-whatsapp.dto';
import { getQrCode, whatsappConnection } from 'src/core/connection/connection';

@Injectable()
export class WhatsappService {
  create(createWhatsappDto: CreateWhatsappDto) {
    return 'This action adds a new whatsapp';
  }
  delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async findAll() {
    whatsappConnection();
    let qrCode = null;
    if(!getQrCode()){
      await this.delay(20000);
    }   

    return getQrCode();

  }

  findOne(id: number) {
    return `This action returns a #${id} whatsapp`;
  }

  update(id: number, updateWhatsappDto: UpdateWhatsappDto) {
    return `This action updates a #${id} whatsapp`;
  }

  remove(id: number) {
    return `This action removes a #${id} whatsapp`;
  }
}
