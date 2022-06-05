const http = require("http");
const url = require('url');
const fs = require('fs');
const imageURL = './img.jpg';
const request = require('request');

const qrcode = require("qrcode-terminal");
//const { Client, LegacySessionAuth } = require('whatsapp-web.js');

const SESSION_FILE_PATH = './session.json';

//let client;

const spam = true;
const checkToken = true;


const chatBot = true;
const chatBotURL = "http://localhost/";

let sessionData;

let sessao;
let sessobj;

const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

const QRCode = require('qrcode');

estado = 0;

let autorizadosArquivo = fs.readFileSync("./autorizados.json");
let autorizados = JSON.parse(autorizadosArquivo);

let token = JSON.parse(fs.readFileSync("./token.json"));

function redirectChatBot(timestamp, origem, mensagem){

  try {

  request(chatBotURL +"?timestamp=" +timestamp +"&origem=" +origem +"&mensagem=" +mensagem, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log("Encaminhado a API do ChatBot")
     } else {
       console.log("ChatBot não recebeu a mensagem");
     }
})

  } catch(e) {
    console.log("ERRO AO CHAMAR API CHAtBOT");
  }
  

}


function checaToken(__token){


  
    if (token.token == __token) {
      console.log(__token);
      return true;
    } else {
      return false;
    }
  


}


function checaAutorizados(__numero) {

  if (spam == true){
    autorizaNumero(__numero);
  }

    for (x = 0; x < autorizados.length; x++) {
      if (autorizados[x].numero === __numero) {
        return autorizados[x];
      }
    }
    return autorizados[0];
  }


function autorizaNumero(__numero) {
    autorizados.push({ numero: __numero});
    let data = JSON.stringify(autorizados);
    fs.writeFileSync("./autorizados.json", data);

  }


  function persisteRecebidas() {
    let data = JSON.stringify(mensagens);
    fs.writeFileSync("./recebidas.json", data);

  }

  function mostraRecebidas() {
    return fs.readFileSync('./recebidas.json').toString();
  }



mensagens = [
    { timestamp: "000000000000000", origem: "0000000000", mensagem: "-1" }
  ];

client.on('qr', (qr) => {
    estado = 0;
    console.log("Aguardando leitura do QRCode", qr);
    qrcode.generate(qr, {small: true});
    QRCode.toFile('qrcode.png', qr);

});

client.on('ready', () => {
    estado = 1;
    console.log('Pronto para o envio de Mensagens');
});

client.on('message', msg => {
    console.log('teste reescrita', msg.from, " - ", msg.body);

    let date = new Date();

    mensagens.push({ timestamp: date.getTime(), origem: msg.from, mensagem: msg.body });
    persisteRecebidas();

    if (chatBot){
      redirectChatBot(date.getTime(), msg.from, msg.body);
    }


    if (checaAutorizados(msg.from).numero == "00000000000"){
        console.log("Número " +msg.from +" Autorizado com sucesso!");
      autorizaNumero(msg.from);
      }

});


 client.initialize();


 client.on('authenticated', (session) => {
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
      if (err) {
          console.error(err);
      }
  });
});


const server = http.createServer(function(req, res){
    x = url.parse(req.url, { parseQueryString: true });


//    let ip = req.header('x-forwarded-for') || ;


    //console.log(req.connection.remoteAddress);

    
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
          body += chunk.toString(); // convert Buffer to string
      });
      req.on('end', () => {
          ___numero = JSON.parse(body).destino +'@c.us';
          ___mensagem = JSON.parse(body).mensagem +"";
          ___token = JSON.parse(body).token;

          console.log(checaToken(___token));
  

          if (checaAutorizados(___numero).numero == "00000000000"){
            console.log("Número não autorizado, informe ao seu cliente para enviar uma mensagem para autorizar.");
            //res.write("Número não autorizado, informe ao seu cliente para enviar uma mensagem para autorizar.");
            //res.end();
          } else if (checaAutorizados(___numero).numero == ___numero){
            //res.write(___numero + " - " +___mensagem);

            if (checaToken(___token)){
            client.sendMessage(___numero, ___mensagem);
            } else {
              console.log(req.connection.remoteAddress + " - Tentativa de envio com token inválido via POST");
            }
            //res.end();
          }

          
      });
  }

  

    if (x.query.destino){

        ___numero = x.query.destino +'@c.us';
        ___mensagem = x.query.mensagem +"";

        ___token = x.query.token;

        console.log(checaToken(___token));

        if (checaAutorizados(___numero).numero == "00000000000"){
            console.log("Número não autorizado, informe ao seu cliente para enviar uma mensagem para autorizar.");
            res.write("Número não autorizado, informe ao seu cliente para enviar uma mensagem para autorizar.");
            res.end();
          } else if (checaAutorizados(___numero).numero == ___numero){

            if (checaToken(___token)){
              client.sendMessage(___numero, ___mensagem);
              res.write(___numero + " - " +___mensagem);
              } else {
                console.log(req.connection.remoteAddress + " - Tentativa de envio com token inválido via GET");
                res.write(req.connection.remoteAddress + " - Tentativa de envio com token inválido via GET");
              }

            //client.sendMessage(___numero, ___mensagem);
            res.end();
          }


            //console.log(x.query.destino + " - " +x.query.mensagem);
            
    } else {
        switch (req.url){
            case "/recebidas":
                res.writeHead(200, {"Content-Type": "application/json"});
                //res.write(JSON.stringify(mensagens));
                res.write(mostraRecebidas());
                break;
            case "/":
                
                if (estado == 0){
                    // res.write("Mostra qrcode");

                    var img = fs.readFileSync('./qrcode.png');
                    res.writeHead(200, {'Content-Type': 'image/png' });
                    res.end(img, 'binary');

                } else if (estado == 1){
                    
		    //res.write("<img src='" + fileUrl+ "'/>");
		res.write(`
      
			<!doctype html>
			<html>
			<head>
			  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@9"></script>
			</head>
			<body style="font-family: sans-serif; ">
			  <div style="height: 500px;">
			    <button onclick="fireSweetAlert()">Clique para ver o status da API</button>
			  </div>
			  <script>

		    function fireSweetAlert() {
		        Swal.fire(
            			'Bom Trabalho!',
		                'API WhatsApp Rodando OK! Se foi util pra vc envie um Pix de qualquer valor para o Mano aqui 11999623179',
			        'success'
        )
    }

  </script>
</body>
</html>
			
			
			
			`);
                }
                
                break;
            default:
                res.write("Caminho inválido");
        }
        try {
        res.end();
        } catch(e){
            console.log("Nada a fazer");
        }
    }
});

server.listen(8080);
console.log('API WhatsApp Running port 8080');
