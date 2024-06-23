const path = require('path');
const express = require('express');
const http = require('http'); // works under the hood in express
const socketio = require('socket.io');
const formatMessage=require('./utils/messages')
const {userjoin,getcurrentuser,userleave,getRoomUser}=require('./utils/users')

const app = express();
const server = http.createServer(app); // to use it directly
const io = socketio(server);

// Set static folder or connect static folder
app.use(express.static(path.join(__dirname, 'public')));


const BOT='Chatbuddy'
// Run when client connects
// Listen for connection
io.on('connection', socket => {

  //catch joinroom
  socket.on('joinroom',({username,room})=>{
    const user =userjoin(socket.id,username,room);

    // console.log('User joined:', user); 
    socket.join(user.room);

    
      // To emit a message to client from server
      socket.emit('message', formatMessage(BOT,'Welcome to this chatroom'));
      
        //broadcast when a new user connect message not shown to new client 
       socket.broadcast.to(user.room).emit('message',
        formatMessage(BOT,`${user.username}  has joined the chat`));

        //give real time info of no of user in the room and room name
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUser(user.room)
        });
          
  });
  //listen for chatmessage
  socket.on('chatmessage',msg=>{
const user =getcurrentuser(socket.id);

    io.to(user.room).emit('message',formatMessage(user.username,msg));
  });
  
  // when client disconnects
  socket.on('disconnect',()=>{
    const user =userleave(socket.id);

    if(user){
      io.to(user.room).emit('message',formatMessage(BOT,`${user.username} has left the  chat`));
    }
    //when someone left update the sidebar 
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUser(user.room)
      });
    }); 
    // socket.on('disconnect', () => {
    //   const user = userleave(socket.id);
    //   if (user) {
    //     io.to(user.room).emit('message', formatMessage(BOT, `${user.username} has left the chat`));
    //
    //     // when someone left update the sidebar 
    //     io.to(user.room).emit('roomUsers', {
    //       room: user.room,
    //       users: getRoomUser(user.room)
    //     });
    //   }
    // });   
});

const PORT = process.env.PORT || 3000; // Check environment variable port
// To run a server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
