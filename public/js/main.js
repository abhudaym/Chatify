const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users')


//Get usernames and room from the url
const { username,room } = Qs.parse(window.location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username , room }); 

//Message from server
socket.on('message', (message) => {
    
    console.log(message);
    outputMessage(message);

    //Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;

})
 

//Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Get message text
    const msg = e.target.elements.msg.value;

    //Emit message to server
    socket.emit('chatMessage', msg);

    //Clear Input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Get Users in a room
socket.on('roomUsers', ({room,users}) => {
    outputRoomName(room);
    outputUsers(users);
});


//Output message to dom
function outputMessage (message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.textMessage}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);  
}

// Add room Name to dom
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to dom
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}

