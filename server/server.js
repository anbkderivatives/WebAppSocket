const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
var moment = require('moment');

const {Users} = require('./users');

const {isRealString} = require('./validation');
//same 
//const isRealString = require('./validation').isRealString;

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app)
var io =socketIO(server);;

var users = new Users();

app.use(express.static(publicPath));

 //io-> send to each or everybody who is connected
 //io.emit() -> send emitted requests to each or everybody who is connected
 //socket.broadcast.emit() -> send emitted requests to each or everybody who is connected except the current user connected
 //io.to().emit() -> send emitted requests to each or everybody who is connected  to  a specific j o i n object (room)
 //socket.broadcast.to().emit() -> send emitted requests to each or everybody who is connected to a specific join object (room) except the current user connected

io.on('connection', (socket)=>{
  console.log('New user connection');

  socket.on('join',(params,callback)=>{ //callbck like as -> acknowledgement 
    //console.log(params.name+' '+params.room)
    if(!isRealString(params.name) || !isRealString(params.room))
    {
      callback('Name and Room are required, must be given real strings');
      return;
    }

    callback(); // no errors call
    
    //set j o i n object 
    socket.join(params.room);
   // 
    // socket.leave('The Office Fans');
    // io.emit -> io.to('The Office Fans').emit
    // socket.broadcast.emit -> socket.broadcast.to('The Office Fans').emit
    // socket.emit
   // 

    //remove user from any potenional room and add user to current room and this.users 
    users.removeUser(socket.id);
    users.addUsers(socket.id,params.name,params.room);

    io.to(params.room).emit('updateUserList', users.getUsersList(params.room));
    io.to('index').emit('updateRoomList', users.getRoomList())

    socket.emit('newMessage', {
      from: 'Admin',
      text: 'Welcome to the chat app',
      createdAt: new Date().getTime()
    });
    socket.broadcast.to(params.room).emit('newMessage', {
      from: 'Admin',
      text: `${params.name} has joined.`,
      createdAt: new Date().getTime()
    });
  });

socket.on('joinIndex', () => {
    socket.join('index');
    socket.emit('updateRoomList', users.getRoomList());
});
/*  
  socket.emit('newMessage', {
      from: 'Admin',
      text: 'Welcome to the chat app',
      createdAt: new Date().getTime()
    });

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined',
    createdAt: new Date().getTime()
  });
*/

  socket.on('createMessage', (message,acknowledgement) => {
    //console.log('createMessage', JSON.stringify(message,undefined,2));
    
    var user = users.getUser(socket.id);
  //
    //if user exists and the message sended by user is real stringi, allow to procced the message to main chat
    // if(user && isRealString(message.text) )
    // {
    //   io.to(user.room).emit('newMessage', {
    //     from: `${user.name}`,//message.from,
    //     text: message.text,
    //     //new Date().getTime() is the same with moment().valueOf() 
    //     createdAt: moment().valueOf() 
    //   });
    // }
  //
    io.to(user.room).emit('newMessage', {
      from: `${user.name}`,//message.from,
      text: message.text,      
      createdAt: moment().valueOf() //new Date().getTime() is the same with moment().valueOf() 
    });
    acknowledgement();
  });

  socket.on('createLocationMessage',(coords)=>{
    var user = users.getUser(socket.id);

    io.to(user.room).emit('newLocationMessage', {
        from: `${user.name}`,//'Admin',
        //text: coords.latitude + "," + coords.longitude,
        url: `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`, 
        //new Date().getTime() is the same with moment().valueOf() 
        createdAt: moment().valueOf()
    });
   // 
    //or checking first the existance of user 
    // if(user){// if user exist
    //   io.to(user.room).emit('newLocationMessage', {
    //     from: `${user.name}`,//'Admin',
    //     //text: coords.latitude + "," + coords.longitude,
    //     url: `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`, 
    //     //new Date().getTime() is the same with moment().valueOf() 
    //     createdAt: moment().valueOf()
    //   });
    // }
   // 
  });

  socket.on('disconnect',()=>{
      console.log('User was disconnected');
      var user = users.removeUser(socket.id);
      if(user){
        //udate user list
        io.to(user.room).emit('updateUserList',users.getUsersList(user.room));
        //inform that user has left
        io.to(user.room).emit('newMessage',{
          from: 'Admin',
          text: `${user.name} has left.`
        });
      }
    });

});
server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});