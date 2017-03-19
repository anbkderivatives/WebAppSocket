var socket = io();

function scrollToBottom(){
    //Selectors
    var messages = $('#listMessages');
    var newMessage = messages.children('li:last-child');

    //Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        //console.log('Scroll');
        messages.scrollTop(scrollHeight);
    }
}

//var params;
socket.on('connect',function(){
    console.log("connected to server");
    var params = $.deparam(window.location.search); //or $.deparam();

    socket.emit('join',params,function(err){
        if(err){
            alert(err);
            window.location.href = "/" ;
        }
        //no errors
    });
});

socket.on('disconnect',function(){
    console.log('Disconnected from server');
});

socket.on('updateUserList',function(users){
    //console.log('users',users)
    var ol = $('<ol></ol>');
    users.forEach(function(u){
        ol.append( $('<li></li>').text(u) );
    });

    $('#users').html(ol);
    //it is not used append cause will be added below the new gotten lists of users
    //with html use, is being refreshed the content
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    text: message.text,    
    createdAt: formattedTime
  });

  jQuery('#listMessages').append(html);

  /* 
  //Different solution, provision of css styles become more complex
  console.log('newMessage', message);
  var formatedTime = moment(message.createdAt).format('h:mm a');
  var li = $("<li></li>");
  li.text(`${message.from} ${formatedTime}: ${message.text}`);

  $('#listMessages').append(li);
  */
  scrollToBottom();
});

socket.on('newLocationMessage',function(message){

    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });

    jQuery('#listMessages').append(html);

   /*
    //Different solution, provision of css styles become more complex
    var li = $('<li></li>');
    var a = $('<a target="_blank">My current location</a>');

    li.text(`${message.from}:`);
    a.attr('href',message.url);

    li.append(a);
    $('#listMessages').append(li);
   */
    scrollToBottom();
});

/*
    socket.emit('createMessage', {
        from: 'Joe',
        text: 'bring your friends'
    },function(){
        console.log('Got it');
    });
    socket.emit('createMessage', {
        from: 'Hey Joe',
        text: 'Yup, that works for me.'
    },function(){
        console.log('Got it 2');
    });
*/

$('#message-form').on('submit', function (e) {
    //e = event of submit form from "Send" button
    e.preventDefault();//do not refresh page as the default submit do

    socket.emit('createMessage', 
    {
        //from: 'User', //`${params.name}`,
        text: $('[name=message]').val()
    }, 
    function () {
        $('[name=message]').val('');
    });
});

var locationButton = $('#send-location');

locationButton.on('click',function(){
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled','disabled').text('Sendig location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        //after all gone well enable locationButton
        locationButton.removeAttr('disabled').text('Send Location');
        //console.log(position);
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch location.');
    });
});