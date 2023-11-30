import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateWhatsappDto } from '../dto/create-whatsapp.dto';
import { UpdateWhatsappDto } from '../dto/update-whatsapp.dto';
import { WhatsappService } from '../services/whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post()
  create(@Body() createWhatsappDto: CreateWhatsappDto) {
    return this.whatsappService.create(createWhatsappDto);
  }

  @Post('sendmessage')
  sendMessage(@Body() sendMessageDto: CreateWhatsappDto) {
    return this.whatsappService.create(sendMessageDto);
  }

  @Get()
  findAll() {
    return this.whatsappService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.whatsappService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWhatsappDto: UpdateWhatsappDto) {
    return this.whatsappService.update(+id, updateWhatsappDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.whatsappService.remove(+id);
  }
}
