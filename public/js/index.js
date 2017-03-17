var socket = io();

socket.on('connect',function(){
    console.log("connected to server");

    /*socket.emit('createMessage', {
        from: 'Andreas',
        text: 'Yup, that works for me.'
    });*/
});

socket.on('disconnect',function(){
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage', message);

  var li = $("<li></li>");
  li.text(`${message.from}: ${message.text}`);

  $('#listMessages').append(li);
});

/*socket.emit('createMessage', {
        from: 'Frank',
        text: 'bring your friends'
    },function(){
        console.log('Got it');
    });
socket.emit('createMessage', {
        from: 'Andreas',
        text: 'Yup, that works for me.'
    },function(){
        console.log('Got it 2');
    });*/

$('#message-form').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: $('[name=message]').val()
  }, function () {

  });
});