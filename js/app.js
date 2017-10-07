var ip = "mycroft.lackey.io"

function set_ip(val)
{
    ip=val
    console.log("New ip 1="+ ip)
}


$(document).ready(function(){

var response = $('#response');

var socket = new WebSocket("wss://"+ip+"/core");
console.log("wss://"+ip+"/core")
// var socket = new WebSocket("wss://localhost/core");
 
socket.onopen = function(){  
  console.log("connected");
  response.append("Hello, how may I help you?")
  response.append($('<br/>')); 
}; 

socket.onmessage = function (message) {
  console.log("receiving: " + message.data);
  if (message.data.indexOf('expect_response') >=0)
  {
    console.log("This is my testing: " + message.data)
    var msg = message.data.slice(50, -37);
    response.append(msg)
    console.log("The message data is:" + message.data)
    console.log("This is the msg: " + msg)
    if (msg)
    {
    // received.append($("#received").css({"color": "#3498D8"}));
    response.append($("#received").css({"color": "#666666"}));
    response.append($('<br/>'));
    } else {
    // received.append($("#received").css({"color": "#35495d"}));
    response.append($("#received").css({"color": "#999999"}));
    response.append($('<br/>'));
    }

    $("#response").scrollTop($("#response")[0].scrollHeight);
  }
  
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