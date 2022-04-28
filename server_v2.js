const WebSocket = require("ws");
const { Client } = require("whatsapp-web.js");
const client = new Client();
const fs = require('fs');

const wss = new WebSocket.Server({ port: 8080 });
let estado = "";
let qrtemp = "";

wss.on("connection", ws => {
  ws.on("message", message => {
    comando = "";
    try {
      comando = JSON.parse(message);
    } catch (e) {
      ws.send("Comando inválido");
      return;
    }

    switch (comando.comando) {
      case "conectado":
        k = conectado("Cliente Conectato com sucesso");
        console.log(k);
        //ws.send(k);
        break;
      case "conectar":
        conectar();
        break;

      case "enviar":
        enviar();
        break;

      case "entrarGrupo":
        entrarGrupo();
        break;

      default:
        console.log(
          "default comando desconhecido",
          JSON.parse(JSON.stringify(message)).comando
        );
    }
  });

  client.on("qr", qr => {
    //console.log(qr);
    ws.send(qr);
  });

  client.on("ready", () => {
    console.log("Client is ready!");
  });

  client.on("message", msg => {
    if (msg.body == "!ping") {
      msg.reply("pong");
    }
  });
});

function conectado(x) {
  console.log(x);
  return x;
}

function conectar() {
  client.initialize();
}

function enviar() {}

function entrarGrupo() {}
