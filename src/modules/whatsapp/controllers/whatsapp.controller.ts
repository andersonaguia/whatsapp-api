import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WhatsappService } from '../services/whatsapp.service';
import { NewMessageDto } from '../dto/new-message.dto.ts';
import { sessionData } from 'src/modules/whatsapp/interfaces/session-data.interface';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get('connect')
  connect(): any {
    return this.whatsappService.connect();
  }

  @Get('findconnectiondata')
  findConnectionData(): sessionData {
    return this.whatsappService.findConnectionData();
  }

  @Get('findallchats')
  async findAllChats() {
    return await this.whatsappService.findAllChats();
  }

  @Get('findallchatsgroups')
  async findAllChatsGroups() {
    return await this.whatsappService.findAllChatsGroups();
  }

  @Get('findallcontacts')
  async findAllContacts() {
    return await this.whatsappService.findAllContacts();
  }

  @Get('findchatbyname')
  async findChatByName() {
    return await this.whatsappService.findGroupContactByName('Alarmes');
  }

  @Post('sendmessage')
  async sendMessage(@Body() data: NewMessageDto) {
    return await this.whatsappService.sendMessage(data);
  }

  @Post('logout')
  async logout() {
    return await this.whatsappService.logout();
  }
}
