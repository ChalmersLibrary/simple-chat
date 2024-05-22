const socket = io();

let nickname = '';
let start = 0;

const login = () => {
  const nicknameInput = document.getElementById('nickname').value;
  const secretCodeInput = document.getElementById('secretCode').value;

  if (nicknameInput && secretCodeInput === '1234') { // Change secret code here if needed
    nickname = nicknameInput;
    document.getElementById('login').style.display = 'none';
    document.getElementById('chat').style.display = 'block';
  } else {
    alert('Invalid nickname or secret code!');
  }
};

const logout = () => {
  document.getElementById('login').style.display = 'block';
  document.getElementById('chat').style.display = 'none';
  document.getElementById('nickname').value = '';
  document.getElementById('secretCode').value = '';
};

const sendMessage = () => {
  const messageInput = document.getElementById('messageInput').value;
  if (messageInput) {
    const message = {
      nickname: nickname,
      text: messageInput,
      timestamp: Date.now(),
      type: 'text'
    };
    socket.emit('new message', message);
    document.getElementById('messageInput').value = '';
  }
};

const searchGif = () => {
    const query = prompt('Enter a search term for the GIF:');
    if (query) {
      fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${query}&limit=5`)
        .then(response => response.json())
        .then(data => {
          const gifContainer = document.getElementById('gifContainer');
          gifContainer.innerHTML = '';
          data.data.forEach(gif => {
            const img = document.createElement('img');
            img.src = gif.images.fixed_width.url;
            img.className = 'gif';
            img.onclick = () => sendGif(gif.images.fixed_width.url);
            gifContainer.appendChild(img);
          });
        })
        .catch(err => console.error(err));
    }
};

const sendGif = (gifUrl) => {
  const message = {
    nickname: nickname,
    gifUrl: gifUrl,
    timestamp: Date.now(),
    type: 'gif'
  };
  socket.emit('new message', message);
};

socket.on('load messages', (messages) => {
  start = messages.length;
  messages.forEach((msg) => {
    if (msg.type === 'text') {
      displayMessage(msg.nickname, msg.text);
    } else if (msg.type === 'gif') {
      displayGif(msg.nickname, msg.gifUrl);
    }
  });
});

socket.on('load more messages', (messages) => {
  start += messages.length;
  messages.reverse().forEach((msg) => {
    if (msg.type === 'text') {
      displayMessage(msg.nickname, msg.text, true);
    } else if (msg.type === 'gif') {
      displayGif(msg.nickname, msg.gifUrl, true);
    }
  });
});

socket.on('new message', (msg) => {
  if (msg.type === 'text') {
    displayMessage(msg.nickname, msg.text);
  } else if (msg.type === 'gif') {
    displayGif(msg.nickname, msg.gifUrl);
  }
});

const displayMessage = (nickname, text, prepend = false) => {
  const messagesDiv = document.getElementById('messages');
  const messageElement = document.createElement('div');
  messageElement.textContent = `${nickname}: ${text}`;
  if (prepend) {
    messagesDiv.insertBefore(messageElement, messagesDiv.firstChild);
  } else {
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
};

const displayGif = (nickname, gifUrl, prepend = false) => {
  const messagesDiv = document.getElementById('messages');
  const messageElement = document.createElement('div');
  messageElement.innerHTML = `${nickname}: <img src="${gifUrl}" class="gif">`;
  if (prepend) {
    messagesDiv.insertBefore(messageElement, messagesDiv.firstChild);
  } else {
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
};

document.getElementById('messages').addEventListener('scroll', () => {
  if (document.getElementById('messages').scrollTop === 0) {
    socket.emit('load more messages', start);
  }
});
