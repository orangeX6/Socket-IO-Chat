const io = require('socket.io')(3000, {
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
