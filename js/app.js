var ip = "mycroft.lackey.io"

function set_ip(val)
{
    ip=val
    console.log("New ip 1="+ ip)
}


$(document).ready(function(){

var received = $('#received');

var socket = new WebSocket("wss://"+ip+"/core");
console.log("wss://"+ip+"/core")
// var socket = new WebSocket("wss://localhost/core");
 
socket.onopen = function(){  
  console.log("connected"); 
}; 

socket.onmessage = function (message) {
  console.log("receiving: " + message.data);
  received.append(message.data);

  var msg = message.data.substr(0, 1);
  console.log("The message data is:" + message.data)
  if (msg == "-")
  {
  // received.append($("#received").css({"color": "#3498D8"}));
  received.append($("#received").css({"color": "#666666"}));
  received.append($('<br/>'));
  } else {
  // received.append($("#received").css({"color": "#35495d"}));
  received.append($("#received").css({"color": "#999999"}));
  received.append($('<br/>'));
  }

  $("#received").scrollTop($("#received")[0].scrollHeight);

};

socket.onclose = function(){
  console.log("disconnected"); 
};

var sendMessage = function(message) {
  console.log("sending:" + message.data);
  var mycroft_data = '{"utterances": ["' + message.data + '"]}'
  var mycroft_msg = '{"type": "recognizer_loop:utterance", "data": ' + mycroft_data + '}'
  socket.send(mycroft_msg);
};



$("#cmd_send").click(function(ev){
  ev.preventDefault();
  var cmd = $('#cmd_value').val();
  sendMessage({ 'data' : cmd});
  $('#cmd_value').val("");
});

$('#clear').click(function(){
  received.empty();
});

$('#stop').click(function(){
   sendMessage({ 'data' : 'stop'});
});

});