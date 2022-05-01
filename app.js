const qrcode = require('qrcode-terminal');
const express = require('express');

const fs = require('fs');
const { Client,LocalAuth } = require('whatsapp-web.js');
const app = express();
app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", CLIENT_ORIGIN);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.header("Access-Control-Allow-Credentials", true); 
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
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
      console.log("Gothe request",req.body);
    const { number, message } = req.body; // Get the body
    const msg = await sendMessageToNumber(message,number); // Send the message
    res.send({ msg }); // Send the response
  } catch (error) {
    next(error);
  }
});

const PORT = process.env.PORT || 3050;
app.listen(PORT, () => console.log(`🚀 @ https://elaborate-platypus-832699.netlify.app:${PORT}`));
