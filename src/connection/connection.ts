const venom = require('venom-bot');

let clientData = '';

export async function whatsappConnection() {
  await venom
    .create({
      session: 'ubuntu-server',
    })
    .then((client) => clientData = client)
    .catch((error) => {
      console.log(error);
    });
  return;
}

export function getClient() {
  return clientData;
}


