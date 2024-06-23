const chatmessages=document.querySelector('.chat-messages');
const roomname=document.getElementById('room-name')
const userlist= document.getElementById('user-list')
const socket=io();

//get username and room from url
const{ username,room }=Qs.parse(location.search,{
ignoreQueryPrefix:true
});

//join chatroom
socket.emit('joinroom',{username,room});

//get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomname(room);
    outputUsername(users);
  });


// to catch the emitted message
//MESSAGE FRM SERVER
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);

//scroll down automatically
chatmessages.scrollTop= chatmessages.scrollHeight;
});

//messsage submit
const chatform=document.getElementById('chat-form')


chatform.addEventListener('submit',(e)=>{
    //prevent storing into a file
    e.preventDefault();
    //get message from text input and log it into clint side\
    const msg=e.target.elements.msg.value;

    //emit message to server
    socket.emit('chatmessage',msg);
    
    //clear input textbox after submiting
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();

})
//output message to DOM
function outputMessage(message){
        const div=document.createElement('div');
        div.classList.add('message')
        div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p> 
        <p class="text">
        ${message.text}
        <p>`;
        document.querySelector('.chat-messages').appendChild(div);
}

const leaveBtn = document.getElementById('leave-btn');

leaveBtn.addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location ='http://localhost:3000/'; // Redirect to the desired page
    }
  });

function outputRoomname(room){
    roomname.innerText=room;
}


//add user to dom
function outputUsername(users){
userlist.innerHTML =`
       
        ${users.map(user => `<li>${user.username}</li>`).join('')}
                   `;

}
// ${users.map(user => `<li><img src="${user.avatarUrl}" alt="avatar" class="avatar"> ${user.username}</li>`).join('')}