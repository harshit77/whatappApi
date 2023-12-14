const qrcode = require('qrcode-terminal');
const express = require('express');

const { Client } = require('whatsapp-web.js');
const app = express();
app.use(express.json());

const client = new Client({
    puppeteer: { 	      headless: true,
                  args: ['--no-sandbox','--disable-setuid-sandbox']  },
}
);

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
    sendMessageToNumber("Hi","918840213727")
    client.on('message', message => {
        if(message.body === '!ping') {
            message.reply('pong');
        }
    });
});

  client.initialize();

const sendMessageToNumber= async (message,number) =>{
         console.log(number);

    const getNumberId= await client.getNumberId(number);
     console.log(getNumberId);
    if(getNumberId) {
        console.log(getNumberId)
     await client.sendMessage(getNumberId._serialized,message)
    }
    else {
        console.log("Mobile number is not registered")
    }

}

app.get("/",(req,res)=>res.send("Hello World"))

app.post('/sendmessage', async (req, res) => {
  try {
      console.log("Gothe request",req.body);
    const { number, message } = req.body; // Get the body
    const msg = await sendMessageToNumber(message,number); // Send the message
    res.send({ msg }); // Send the response
  } catch (error) {
    console.log(error);
  }
});

const PORT = process.env.PORT || 3050;
app.listen(PORT, () => console.log(`app listening on port ${PORT}!`));

