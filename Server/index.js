const path = require('path');

const express = require('express');
// const server = http.createServer(app);
const app = express();

app.use(express.static(path.join(__dirname, `../Client`)));

app.get('/', (req, res) => {
  console.log(__dirname);
  res.sendFile(__dirname + '/index.html');
});

const server = app.listen(8000, () =>
  console.log(`App running on port 8000..`)
);

const io = require('socket.io')(server, {
  cors: { origin: '*' },
});

const users = {};

io.on('connection', (socket) => {
  // console.log('new User');
  // socket.emit('chat-message', 'hello world');
  socket.on('new-user', (name) => {
    users[socket.id] = name;
    socket.broadcast.emit(`user-connected`, name);
  });

  socket.on('send-message', (message) => {
    socket.broadcast.emit('chat-message', { message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('chat-disconnected', users[socket.id]);
    delete users[socket.id];
  });
});
