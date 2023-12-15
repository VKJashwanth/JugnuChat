const cleanser = require('profanity-cleanser');
const express = require('express');
const filter = require('profanity-filter');
const formatMessage = require('./utils/messages');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'ChatMessage Bot';
const botKeys = [
  '$admin',
  '$administrator',
  '$mod',
  '$moderator',
  '$encourage-bot',
  '$joke-bot',
  '$meme-bot'
]

cleanser.setLocale();

function cleanse(text) {
  filter.setReplacementMethod('word', '[CENSORED]');
  // THIS WAS DONE BY @R0YEE and @Coder992 (A little bit from Coder595)
  cleanser.addWords(['stfu', 'Hell', 'fuc', 'bich', 'gay', 'lesbian', 'Lesbain', 'Female Dog', 'female dog', 'fucking', 'Ass', 'Sh!t', 'Fucking', 'Dick', 'Jackass', 'ball sack', 'fucker', 'Fucker', 'nigger', 'Nigger', 'NIGGA', 'ASS', 'Pussy', 'PUSSY', 'Pussy', 'NIGGER', 'FUCKING', 'FUCKER', 'DICK', 'HELL', 'BITCH', 'love', 'LOVE', 'dic', 'DIC', 'Love', 'asshole', 'ASSHOLE', 'Asshole', 'Bullshit', 'BULLSHIT', 'SHIT', 'Shit', 'FUCK', 'BITCH', 'jackass', 'Jackass', 'JACKASS', "Rishik", "rishik"])
  let cleansed_text = filter.clean(text);
  cleansed_text = cleanser.replace(text, 'word', '[CENSORED]');
  return cleansed_text;
}

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    socket.emit('message', formatMessage(botName, 'Welcome to the chat!!'));
    socket.broadcast
      .to(user.room)
      .emit('message', formatMessage(botName, cleanse(`${user.username.replaceAll('<', '&lt;').replaceAll('>', '&gt;')} has joined the chat!`)));
    io.to(user.room)
      .emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    socket.on('chatMessage', msg => {
      let msg2 = cleanse(msg)
      const user = getCurrentUser(socket.id);
      io.to(user.room)
        .emit('message', formatMessage(user.username.replaceAll('<', '&lt;').replaceAll('>', '&gt;'), msg2.replaceAll('<', '&lt;').replaceAll('>', '&gt;')));
    });
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room)
        .emit('message', formatMessage(botName, cleanse(`${user.username.replaceAll('<', '&lt;').replaceAll('>', '&gt;')} has left the chat!`)));
      io.to(user.room)
        .emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
    }
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Server listening on port *:${port}`));