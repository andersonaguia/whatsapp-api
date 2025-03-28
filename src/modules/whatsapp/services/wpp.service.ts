const venom = require('venom-bot');

import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import { sessionData } from '../interfaces/session-data.interface';
import { NewMessageDto } from '../dto/new-message.dto.ts';
import { MessageSuccessResultDto } from '../dto/message-success-result.dto';
import { MessageErrorResultDto } from '../dto/message-error-result.dto';
import { Cron } from '@nestjs/schedule';

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
export class WppService implements OnModuleInit {
  constructor() {}

  async onModuleInit() {
    //await this.connect();
    console.log(process.env.CELL_NUMBER);
  }

  async connect() {
    const client = await venom.create(
      {
        session: 'ubuntu-server',
        headless: 'new',
        //headless: false,
        browserArgs: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-software-rasterizer',
        ],
      },
      (base64Qrimg, asciiQR, attempts, urlCode) => {
        connData.attempts = attempts;
        connData.asciiQR = asciiQR;
        connData.base64Qrimg = base64Qrimg;
        connData.urlCode = urlCode;
        // console.log('Number of attempts to read the qrcode: ', attempts);
        // console.log('Terminal qrcode: ', asciiQR);
        // console.log('base64 image string qrcode: ', base64Qrimg);
        // console.log('urlCode (data-ref): ', urlCode);
      },
      (statusSession, session) => {
        console.log('Status Session: ', statusSession);
        console.log('Session: ', session);
        connData.statusMessage = statusSession;
      },
      // BrowserInstance
      (browser, waPage) => {
        console.log('Browser PID:', browser.process().pid);
        waPage.screenshot({ path: 'screenshot.png' });
      },
    );

    clientData = client;

    let time = 0;
    client.onStreamChange((state) => {
      console.log('State Connection Stream: ' + state);
      clearTimeout(time);
      if (state === 'DISCONNECTED' || state === 'SYNCING') {
        setTimeout(() => {
          client.close();
          console.log('Cliente Desconectado');
        }, 5000);
      }
    });

    client
      .onStateChange((state) => {
        console.log('State changed: ', state);
        // force whatsapp take over
        if ('CONFLICT'.includes(state)) client.useHere();
        // detect disconnect on whatsapp
        if ('UNPAIRED'.includes(state)) console.log('logout');
      })
      .catch((error) => {
        console.log('Erro ao fazer login');
      });
    /*
    client.onMessage((data) => {
      //console.log(data);
      if (data.isGroupMessage || data.from.includes('@g.us')) {
        console.log('Mensagem oriunda de grupos');
        return;
      } else if (data.chatId.includes('newsletter')) {
        console.log('Mensagem oriunda de newsletter');
        return;
      } else {
        const received = {
          name: data.notifyName,
          number: data.from,
          message: data.content,
          responseMessage: data.notifyName
            ? `Olá ${data.notifyName}, como posso ajudar?`
            : `Olá, como posso ajudar?`,
        };
        //this.autoResponse(client, number, message);
        console.log(received);
        return;
      }
    });
    */
  }

  clearData() {
    this.deleteTokensFolder();
    clientData = '';
    connData.attempts = 0;
    connData.name = '';
    connData.statusMessage = 'Desconectado';
    connData.base64Qrimg = '';
    connData.asciiQR = '';
    connData.urlCode = '';
  }

  async checkConnected(client) {
    const isConnected = await client.isConnected();
    return isConnected;
  }

  async getConnectionState(client) {
    const connectionState = await client.getConnectionState();
    return connectionState;
  }

  async restartService(client) {
    try {
      const unlogged = await client.logout(client);
      this.clearData();

      if (unlogged) {
        return {
          code: 200,
          message: 'Desconectado, favor realizar a conexão novamente!',
        };
      }

      return {
        code: 200,
        message: 'Ocorreu um erro ao tentar fazer logout, tente novamente!',
      };
    } catch (error) {
      console.log(error);
    }
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

  autoResponse(
    client: any,
    number: string,
    message: string,
  ): Promise<MessageSuccessResultDto | MessageErrorResultDto> {
    return new Promise(async (resolve, reject) => {
      try {
        await client
          .sendText(number, `${message}`)
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

  sendMessage(
    data: NewMessageDto,
    client: any,
  ): Promise<MessageSuccessResultDto | MessageErrorResultDto> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await client.sendText(data.number, `${data.message}`);
        //console.log(result);
        resolve(result);
      } catch (error) {
        console.log('ERRO SEND MESSAGE: ', error);
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

  @Cron('0 */30 0-23 * * *')
  handleCron() {
    let content = new NewMessageDto();
    content.number = process.env.CELL_NUMBER;
    content.message = '✅ Im alive!';

    if (connData.statusMessage == 'successChat') {
      this.sendMessage(content, clientData);
    }
  }
}
