import { Injectable } from '@nestjs/common';
import { sessionData } from 'src/modules/whatsapp/interfaces/session-data.interface.js';
import { WppService } from './wpp.service.js';
import { NewMessageDto } from '../dto/new-message.dto.ts.js';
@Injectable()
export class WhatsappService {
  constructor(private readonly wppService: WppService) {}

  connect(): object {
    this.wppService.connect();
    return {
      code: 200,
      message:
        'Verifique o status da conexão e escaneie o QRCode assim que disponível',
      headers: {
        location: 'http://localhost:3003/whatsapp/findconnectiondata',
      },
    };
  }

  findConnectionData(): sessionData {
    return this.wppService.getSessionData();
  }

  restartConnection() {
    return new Promise(async (resolve, reject) => {
      try {
        const client = this.wppService.getClientData();
        if (client) {
          const res = await this.wppService.restartService(client);
          resolve(res);
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
        const result = await this.wppService.sendMessage(data, client);
        
        if (result.erro) {
          resolve({ code: 202, message: result.text });
        }
        resolve({ code: 201, message: result.status.messageSendResult });

        resolve({ code: 401, message: 'Cliente não está logado.' });
      } catch (error) {
        try {
          await this.wppService.connect();

          await new Promise(res => setTimeout(res, 10000));
  
          const client = this.wppService.getClientData();
          const retryResult = await this.wppService.sendMessage(data, client);
  
          if (retryResult.erro) {
            return resolve({ code: 202, message: retryResult.text });
          }
  
          return resolve({ code: 201, message: retryResult.status.messageSendResult });
  
        } catch (retryError) {
          console.log('❌ Erro ao tentar reconectar e reenviar:', retryError);
          return reject(retryError);
        }
      }
    });
  }
}
