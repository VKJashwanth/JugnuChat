

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users')

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

socket.emit('joinRoom', { username, room });


socket.on('roomUsers', ({ room, users }) => {
  outputUsers(users);
  outputRoomName(room);
});



socket.on('message', message => {
  console.log(message);
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', event => {
  event.preventDefault();
  const msg = event.target.elements.msg.value;
  socket.emit('chatMessage', msg);
  event.target.elements.msg.value = '';
  event.target.elements.msg.focus();
});

function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  var u = document.createElement("p");
  var t = document.createElement("p");
  u.classList.add("meta");
  var uSp = document.createElement("span");
  uSp.innerText = message.username + ' ';
  var tSp = document.createElement("span");
  tSp.innerText = message.time;
  u.appendChild(uSp);
  u.appendChild(tSp);
  div.appendChild(u);
  t.classList.add("text");
  t.innerText = message.text;
  div.appendChild(t);
  document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach(function(user) {
    var li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}