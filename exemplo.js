// client.js

const WebSocket = require('ws')
const url = 'ws://localhost:8080'
const connection = new WebSocket(url)
const qrcode = require("qrcode-terminal");

connection.onopen = () => {
  connection.send('conectado') 
}

connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`)
}

connection.onmessage = (e) => {

  qrcode.generate(e.data, {small: true});

  //console.log(e.data)
}

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
	connection.send(d.toString().trim())
  });
