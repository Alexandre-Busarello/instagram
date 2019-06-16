const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

// Protocolo HTTP
const server = require('http').Server(app);
// Protocolo WebSocket - Utilizado para transferir dados em real-time
const io = require('socket.io')(server);

mongoose.connect('mongodb+srv://busamar:@a03070812@cluster0-9axbm.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
});

// Middleware para todas as requidições onde colocamos a instancia do nosso socket.io
// Com isso é possível utilizar o io para notificar os usuarios em tempo real de mudanças
// em todas as requisições HTTP
app.use((req, res, next) => {
	req.io = io;
	// Repassa para os proximos middlewares ou rotas
	next();
});

// Habilita o CORS para qualquer origem
app.use(cors());

// Criar no meu servidor um repositorio STATIC para referencias as imagens
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')));

app.use(require('./routes'));

server.listen(3333);
