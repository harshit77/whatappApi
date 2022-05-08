const qrcode = require('qrcode-terminal');
const express = require('express');

const { Client,LocalAuth } = require('whatsapp-web.js');
const app = express();
const router = express.Router();
app.use(express.json());
// Use the saved values
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: false },
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

router.get("/",(req,res)=>{
    const messageBody= req.body;
    sendMessageToNumber(messageBody.mesage,messageBody.number)
})

app.use("/.netlify/functions/api",router)


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


app.get('/sendmessage', async (req, res, next) => {
  try {
      console.log("Gothe request",req.body);
    const { number, message } = req.body; // Get the body
    const msg = await sendMessageToNumber(message,number); // Send the message
    res.send({ msg }); // Send the response
  } catch (error) {
    next(error);
  }
});

module.exports.handler = async (event, context, callback)=>{
    let body = {}
    console.log(event)
    try {
      body = JSON.parse(event.body)
      console.log("Request",body)
      const msg = await sendMessageToNumber(body.message,body.number); // Send the message
      res.send({ msg }); // Send the response
    } catch (e) {
      body = parse(event.body)
    }

};