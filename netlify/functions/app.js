
import qrcode from "qrcode-terminal"
import express,{Router} from "express";
import serverless from "serverless-http";
import { Client, Poll, MessageAck} from "whatsapp-web.js";

import { createAndSendMessage, htmlToWhatsapp } from ("../../helper");
const environment = process.env.NODE_ENV || "development"

const app = express();
const router = Router();

app.use("/",router);

const client = new Client({
    puppeteer: {
      headless: true,
      args: ['--no-sandbox','--disable-setuid-sandbox']  
    },
}
);

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', async() => {
    console.log('Client is ready!');
    client.on('message', message => {
        if(message.body === '!ping') {
            message.reply('pong');
        }
    });
});

client.on("message_ack",async (message,acknowdlegment)=>{
  console.log(message);
  if (acknowdlegment === MessageAck.ACK_READ) {
    const { body, to, type } = message;
    try {
      const payload = {
        message: body,
        mobileNumber: to,
        category: type,
        acknowledgement: MessageAck.ACK_READ,
      };
      await fetch(
        environment === "development"
          ? "http://localhost:3000/api/messageOnContacts"
          : "http://dashmindmind.netlify.app/api/messageonContacts",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
})

client.initialize();

const sendMessageToNumber= async ({message,number,mediaURL,externalURL=false}) =>{
 message.forEach(async(item,index)=> {
    const getNumberId = await client.getNumberId(number[index]);
    if(getNumberId) {
        const clientPayload = {
          client,
          message: htmlToWhatsapp(item),
          number: getNumberId._serialized,
          ...(mediaURL
            ? { mediaType: externalURL ? "URL":"FILE_PATH", mediaURL }
            : { mediaType: "MESSAGE_ONLY" }),
        };
     await createAndSendMessage(clientPayload);
    }
    else {
        console.log("Mobile number is not registered")
    }}
)
}

const sendPollToNumber = async({numbers, pollName, options, allowMultipleAnswers=false })=> {
  const pollPayload = new Poll(pollName, options,{allowMultipleAnswers});
    numbers.every(async (number)=>{
      const getNumberId= await client.getNumberId(number);
        if(getNumberId) {
          await client.sendMessage(getNumberId._serialized, pollPayload);
        }
    })
   
}

router.get("/",(req,res)=>res.send("Hello World"))

router.post('/sendmessage', async (req, res) => {
  try {    
    const msg = await sendMessageToNumber(req.body); 
    res.send({ msg });
  } catch (error) {
    console.log("Error",error);
  }
});

router.post("/sendpoll",async(req,res)=>{
  try {
    await sendPollToNumber(req.body)
      res.send("Poll send Succesfully");
  }
  catch(error) {
    console.log("Error",error)
  }

});


export const handler = serverless(app);

