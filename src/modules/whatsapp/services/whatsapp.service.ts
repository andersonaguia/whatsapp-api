import { Injectable } from '@nestjs/common';
import { sessionData } from 'src/modules/whatsapp/interfaces/session-data.interface.js';
import { WppService } from './wpp.service.js';
import { NewMessageDto } from '../dto/new-message.dto.ts.js';
@Injectable()
export class WhatsappService {
  constructor(private readonly wppService: WppService) {}

  connect(): string {
    this.wppService.whatsappConnection();
    return 'checking connection status';
  }

  findConnectionData(): sessionData {
    return this.wppService.getSessionData();
  }

  logout() {
    return new Promise(async (resolve, reject) => {
      try {
        const client = this.wppService.getClientData();
        if (client) {
          const result = await this.wppService.logout(client);
          resolve({ code: 200, message: 'Logout realizado com sucesso!' });
        }
        resolve({ code: 404, message: 'Cliente não está logado.' });
      } catch (error) {
        console.log('ERRO LOGOUT: ', error);
        reject(error);
      }
    });
  }
  findAllChats() {
    return new Promise(async (resolve, reject) => {
      try {
        const client = this.wppService.getClientData();
        if (client) {
          const allChats = await this.wppService.getAllChats(client);

          if (allChats) {
            resolve(allChats);
          }
          resolve({ code: 404, message: 'Nenhum chat encontrado' });
        }
        resolve({ code: 404, message: 'Cliente não está logado.' });
      } catch (error) {
        reject(error);
      }
    });
  }

  findAllChatsGroups() {
    return new Promise(async (resolve, reject) => {
      try {
        const client = this.wppService.getClientData();
        if (client) {
          const allChats = await this.wppService.getAllChatsGroups(client);

          if (allChats) {
            resolve(allChats);
          }
          resolve({ code: 404, message: 'Nenhum chat de gurupo encontrado' });
        }
        resolve({ code: 404, message: 'Cliente não está logado.' });
      } catch (error) {
        reject(error);
      }
    });
  }

  findGroupContactByName(groupName: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const client = this.wppService.getClientData();
        if (client) {
          const allChatsGroups = await this.wppService.getAllChatsGroups(
            client,
          );

          if (allChatsGroups.length > 0) {
            const groupContact = allChatsGroups.filter((chat) => {
              if (chat.name) {
                if (chat.name == groupName) {
                  return chat.id._serialized;
                }
              }
            });
            console.log(typeof groupContact);
            resolve(groupContact);
          }
          resolve({ code: 404, message: 'Nenhum chat de gurupo encontrado' });
        }
        resolve({ code: 404, message: 'Cliente não está logado.' });
      } catch (error) {
        reject(error);
      }
    });
  }

  findAllContacts() {
    return new Promise(async (resolve, reject) => {
      try {
        const client = this.wppService.getClientData();
        if (client) {
          const allContacts = await this.wppService.getAllContacts(client);

          if (allContacts) {
            resolve(allContacts);
          }
          resolve({ code: 404, message: 'Nenhum contato encontrado' });
        }
        resolve({ code: 404, message: 'Cliente não está logado.' });
      } catch (error) {
        reject(error);
      }
    });
  }

  findChatByName(name: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const client = this.wppService.getClientData();
        if (client) {
          const foundChat = await this.wppService.getChatByName(name, client);

          resolve(foundChat);
        }
        resolve({ code: 404, message: 'Cliente não está logado.' });
      } catch (error) {
        reject(error);
      }
    });
  }

  sendMessage(data: NewMessageDto) {
    return new Promise(async (resolve, reject) => {
      try {
        const client = this.wppService.getClientData();
        if (client) {
          const result = await this.wppService.sendMessage(data, client);
          if (result.erro) {
            resolve({ code: 202, message: result.text });
          }
          resolve({ code: 201, message: result.status.messageSendResult });
        }
        resolve({ code: 401, message: 'Cliente não está logado.' });
      } catch (error) {
        reject(error);
      }
    });
  }
}
