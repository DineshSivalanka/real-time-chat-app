const socket = io();

let username = '';
let avatar = '';

const avatarImages = document.querySelectorAll('.avatar');
avatarImages.forEach(img => {
  img.addEventListener('click', () => {
    avatarImages.forEach(i => i.classList.remove('selected'));
    img.classList.add('selected');
    avatar = img.src;
  });
});

const usernameModal = document.getElementById('usernameModal');
const usernameInput = document.getElementById('usernameInput');
const usernameBtn = document.getElementById('usernameBtn');
const chatContainer = document.getElementById('chatContainer');
const messagesList = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');

usernameBtn.addEventListener('click', () => {
  const name = usernameInput.value.trim();
  if (name && avatar) {
    username = name;
    usernameModal.style.display = 'none';
    chatContainer.style.display = 'flex';
    socket.emit('join', { username, avatar });
  } else {
    alert('Enter name and select avatar.');
  }
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', {
      username,
      avatar,
      message: input.value
    });
    input.value = '';
  }
});

socket.on('chat history', (messages) => {
  messagesList.innerHTML = '';
  messages.forEach(data => {
    const li = document.createElement('li');
    li.innerHTML = `<img src="${data.avatar}" class="avatar"><strong>${data.username}</strong>: ${data.message}`;
    messagesList.appendChild(li);
  });
});

socket.on('chat message', (data) => {
  const li = document.createElement('li');
  li.innerHTML = `<img src="${data.avatar}" class="avatar"><strong>${data.username}</strong>: ${data.message}`;
  messagesList.appendChild(li);
});
