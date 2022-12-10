const socket = io('/');

const messageForm = document.getElementById('send');
const messageInput = document.getElementById('message');
const list = document.querySelector('.list');

const now = new Date();
const options = {
  hour: 'numeric',
  minute: 'numeric',
};
const time = Intl.DateTimeFormat('hi-IN', options).format(now);

let username;
if (
  localStorage.getItem('username') &&
  localStorage.getItem('username') !== undefined
) {
  username = localStorage.getItem('username');
} else {
  username = prompt('Enter username - ');
  localStorage.setItem('username', username);
}

const appendMessage = (message, messageFrom = 'chat') => {
  const messageElement = document.createElement('li');
  messageElement.classList.add('text');
  messageElement.innerText = message;
  list.appendChild(messageElement);

  if (messageFrom === 'server') {
    messageElement.classList.add('server');
  }

  if (messageFrom === 'user') {
    messageElement.classList.add('user');
  }
};

appendMessage('Connected to Chat!', 'server');
socket.emit('new-user', username);

socket.on('chat-message', (data) => {
  appendMessage(`${time} | ${data.name}: ${data.message}`);
});

socket.on('user-connected', (data) => {
  appendMessage(`${data} joined!`, 'server');
});

socket.on('chat-disconnected', (data) => {
  appendMessage(`${data} disconnected!`, 'server');
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const message = messageInput.value;
  appendMessage(`${message} | ${time}`, 'user');
  message && socket.emit('send-message', message);

  messageInput.value = '';
});
