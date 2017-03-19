let socket = io()

jQuery(document).ready(selectRoom);

jQuery('#select').change(selectRoom);

   
socket.on('connect', () => {
    //console.log('Connected to server')
    socket.emit('joinIndex')
});

   /*  
    socket.on('disconnect', () => {
    });
   */
 
socket.on('updateRoomList', function (roomNames) {

  let select = jQuery('#select');
  let last = select.children().last().detach();

  roomNames.forEach((name) => {
    let option = jQuery('<option></option>').text(name);
    select.append(option);
  });
  select.append(last);

  jQuery('#select-field').append(select);
});

function selectRoom () {
  //console.log('selectRoom')
  
  let select = jQuery('#select');
  let input = jQuery('#input');
  let text = select.find('option:selected').val();
  
  if (text === 'Make a new room') {
    jQuery('#input-field').show();
    input.val('').focus();
    jQuery('button').removeAttr('disabled');
  } 
  else if (text === 'Choose a room')
  {
    jQuery('#input-field').hide(); 
    jQuery('button').attr('disabled','disabled');    
  }
  else 
  {
    jQuery('#input-field').hide();
    input.val(text);
    jQuery('button').removeAttr('disabled');
  }
}
