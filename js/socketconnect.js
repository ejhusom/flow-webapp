// Copied from osc-web example web-side by Automata / Wilson Vieira. https://github.com/automata/osc-web
var socket = io.connect('http://localhost:8081');
console.log('oi');
socket.on('connect', function() {
     // sends to socket.io server the host/port of oscServer
     // and oscClient
     socket.emit('config',
         {
             server: {
                 port: 3333,
                 host: '127.0.0.1'
             },
             client: {
                 port: 3334,
                 host: '127.0.0.1'
             }
         }
     );
 });

 socket.on('message', function(obj) {
     var status = document.getElementById("status");
     status.innerHTML = obj[0];
     console.log(obj);
 });
