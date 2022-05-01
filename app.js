const qrcode = require('qrcode-terminal');

const fs = require('fs');
const { Client,LocalAuth } = require('whatsapp-web.js');
let sessionData;

// Use the saved values
const client = new Client({
    authStrategy: new LocalAuth()
}
);


client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
    sendMessageToNumber();
    client.on('message', message => {
        if(message.body === '!ping') {
            message.reply('pong');
        }
    });
});

client.initialize();

const sendMessageToNumber= async () =>{
    const number="919415734822";
    const getNumberId= await client.getNumberId(number);
    if(getNumberId) {
        console.log(getNumberId)
     await client.sendMessage(getNumberId._serialized,"Dear Avinash, Your month is about to get over.Your due date is 01/05/2022.")
    }
    else {
        console.log("Mobile number is not registered")
    }

}
