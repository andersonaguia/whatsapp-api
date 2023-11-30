const venom = require('venom-bot');

let clientData = '';
let qrCode = null;

export async function whatsappConnection() {
  await venom
    .create(
      {
        session: 'ubuntu-server',
      },
      (base64Qrimg, asciiQR, attempts, urlCode) => {
        console.log('Number of attempts to read the qrcode: ', attempts);
        console.log('Terminal qrcode: ', asciiQR);
        qrCode = base64Qrimg;
        console.log('base64 image string qrcode: ', base64Qrimg);
        console.log('urlCode (data-ref): ', urlCode);
      },
      (statusSession, session) => {
        console.log('Status Session: ', statusSession);
      },
    )
    .then((client) => (clientData = client))
    .catch((error) => {
      console.log(error);
    });
  return;
}

export function getClient() {
  return clientData;
}

export function getQrCode() {
  return qrCode;
}
