const qrcode = require('qrcode-terminal');
const express = require('express');

const fs = require('fs');
const { Client,LocalAuth } = require('whatsapp-web.js');
const app = express();

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
//     sendMessageToNumber();
    client.on('message', message => {
        if(message.body === '!ping') {
            message.reply('pong');
        }
    });
});

client.initialize();

const sendMessageToNumber= async (message,number) =>{
    const getNumberId= await client.getNumberId(number);
    if(getNumberId) {
        console.log(getNumberId)
     await client.sendMessage(getNumberId._serialized,message)
    }
    else {
        console.log("Mobile number is not registered")
    }

}


app.post('/sendmessage', async (req, res, next) => {
  try {
    const { number, message } = req.body; // Get the body
    const msg = await sendMessageToNumber(message,number); // Send the message
    res.send({ msg }); // Send the response
  } catch (error) {
    next(error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ https://elaborate-platypus-832699.netlify.app:${PORT}`));
