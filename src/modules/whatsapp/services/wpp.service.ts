const venom = require('venom-bot');

import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import { sessionData } from '../interfaces/session-data.interface';
import { NewMessageDto } from '../dto/new-message.dto.ts';
import { MessageSuccessResultDto } from '../dto/message-success-result.dto';
import { MessageErrorResultDto } from '../dto/message-error-result.dto';

let connData: sessionData = {
  attempts: 0,
  name: '',
  statusMessage: 'Desconectado',
  base64Qrimg: '',
  asciiQR: '',
  urlCode: '',
};

let clientData = '';

@Injectable()
export class WppService {
  constructor() {}

  whatsappConnection() {
    try {
      venom
        .create(
          {
            session: 'ubuntu-server',
          },
          (base64Qrimg, asciiQR, attempts, urlCode) => {
            console.log('Number of attempts to read the qrcode: ', attempts);
            connData.attempts = attempts;
            //console.log('Terminal qrcode: ', asciiQR);
            connData.asciiQR = asciiQR;
            //console.log('base64 image string qrcode: ', base64Qrimg);
            connData.base64Qrimg = base64Qrimg;
            //console.log('urlCode (data-ref): ', urlCode);
            connData.urlCode = urlCode;
          },
          (statusSession, session) => {
            console.log('Status Session: ', statusSession);
            console.log('Session: ', session);

            if (statusSession == 'initWhatsapp') {
              connData.statusMessage = 'Iniciando whatsapp...';
            } else if (statusSession == 'isLoggedn') {
              connData.statusMessage = 'Realizando login...';
            } else if (statusSession == 'waitForLogin') {
              connData.statusMessage = 'Logando...';
            } else if (statusSession == 'waitChat') {
              connData.statusMessage = 'Carregando mensagens';
            } else if (statusSession == 'successChat') {
              connData.statusMessage = 'Conectado';
            }
          },
        )
        .then((client) => (clientData = client));
    } catch (error) {
      console.log('Falha na conexão com o whatsapp: ', error);
      //no caso de não logado cai no catch. Tratar solução apagando a pasta tokens
      //this.deleteTokensFolder();
    }
  }

  async logout(client) {
    await client.logout();
    this.deleteTokensFolder();
    clientData = '';
    connData.attempts = 0;
    connData.name = '';
    connData.statusMessage = 'Desconectado';
    connData.base64Qrimg = '';
    connData.asciiQR = '';
    connData.urlCode = '';
  }

  start(client) {
    client.onMessage((message) => {
      if (message.body === 'Hi' && message.isGroupMsg === false) {
        client
          .sendText(message.from, 'Welcome Venom 🕷')
          .then((result) => {
            console.log('Result: ', result); //return object success
          })
          .catch((erro) => {
            console.error('Error when sending: ', erro); //return object error
          });
      }
    });
  }

  async getAllChats(client: any) {
    return await client.getAllChats();
  }

  async getAllChatsGroups(client: any) {
    return await client.getAllChatsGroups();
  }

  async getAllContacts(client: any) {
    return await client.getAllContacts();
  }

  async getChatByName(chatName: string, client: any) {
    const chats = await client.getAllChats();

    if (chats.length > 0) {
      const foundChat = chats.filter((chat) => {
        if (chat.isGroup && chat.name) {
          console.log(chat.name);
          if (chat.name == chatName) {
            return chat;
          }
        } else if (chat.isUser && chat.name) {
          if (chat.name.toLowerCase() == chatName.toLowerCase()) {
            return chat;
          }
        }
      });
      return foundChat;
    }
    return { code: 404, message: 'Nenhum chat encontrado' };
  }

  sendMessage(data: NewMessageDto, client: any) : Promise<MessageSuccessResultDto | MessageErrorResultDto> {
    return new Promise(async (resolve, reject) => {
      try {
        await client
          .sendText(data.number, `${data.message}`)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            resolve(error);
          });
      } catch (error) {
        console.log('ERRO: ', error);
        reject(error);
      }
    });
  }

  getSessionData(): sessionData {
    return connData;
  }

  getClientData() {
    return clientData;
  }

  deleteTokensFolder() {
    const projectRoot = __dirname; // Obtém o diretório do script em execução
    const folderPath = path.join(projectRoot, 'tokens');
    console.log('Caminho do Arquivo: ', folderPath);

    //const folderPath = '/home/anderson/Documents/Projects/whatsapp-api/tokens';
    /*
    const projectRoot = '/app'; // Caminho para a raiz do projeto no Docker
    const folderPath = path.join(projectRoot, 'tokens'); 
  */
    try {
      fs.remove(folderPath);
      console.log('Pasta "tokens" excluída com sucesso.');
    } catch (error) {
      console.error('Erro ao excluir a pasta "tokens":', error);
    }
  }
}
