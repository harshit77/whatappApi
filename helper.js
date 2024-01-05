const { MessageMedia } = require("whatsapp-web.js");
const { parse } = require("node-html-parser");

const createAndSendMessage = async ({
  client,
  message,
  number,
  mediaType = "MESSAGE_ONLY",
  mediaURL,
}) => {
  switch (mediaType) {
    case "URL": {
      const media = await MessageMedia.fromUrl(mediaURL);
  
      await client.sendMessage(number, media, {
        caption: message,
      });
      break;
    }
    case "FILE_PATH": {
      const media = await MessageMedia.fromFilePath(mediaURL);
      
      await client.sendMessage(number, media, {
        caption: message,
      });
      break;
    }
    case "MESSAGE_ONLY": {
      await client.sendMessage(number, message);
    }
  }
};


const htmlToWhatsapp=(htmlString)=>{
  const parsedContent = new parse(htmlString);
  const parsedNode={b:"*",i:"_",strike:"~"}

  const convertToWhatsappFormat = ({ childNodes }) =>
    Array.from(childNodes, (node) => {
      if (node.nodeType == 1) {
        const leafNode = convertToWhatsappFormat(node);
        const code = parsedNode[node.rawTagName];
        return code
          ? leafNode.replace(/^(\s*)(?=\S)|(?<=\S)(\s*)$/g, `$1${code}$2`)
          : leafNode;
      } else {
        return node.textContent;
      }
    }).join("");
   
  return convertToWhatsappFormat(parsedContent);

}


module.exports = { createAndSendMessage, htmlToWhatsapp };