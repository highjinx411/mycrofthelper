var app = angular.module('ChatApp',[]);
app.controller('ChatController', function ($scope){
    $scope.ConnectionIP = "mycroft.lackey.io";    
	$scope.ShowHelp = false;
	$scope.HelpText = "Show Help";
	$scope.Responses = [];
	$scope.ChatText = "";
	$scope.ChatStatus = "Not Connected";
	//$scope.socket  = null;
	try{
	    var socket = new WebSocket("wss://"+$scope.ConnectionIP+"/core");
	    
		socket.onopen = function()
	    {
		   $scope.ChatStatus = "Connected";
		   $scope.$apply();
	    }
		
		socket.onmessage = function (message) {
            console.log("receiving: " + message.data);
		    var response = JSON.parse(message.data);
			if (response.data.expect_response !== undefined)
			{				 
				$scope.Responses.push(response);	
                $scope.$apply();				
			}
		}
		
		socket.onclose = function(){
            $scope.ChatStatus = "Not Connected";
  		    console.log("disconnected"); 
			$scope.$apply();
        };      
		//$scope.socket = socket;
  }
	catch (e)
	{
		$scope.ChatStatus = e.message;
		$scope.$apply();
	}
	  			
	$scope.Clear = function (){
	   $scope.Responses = [];
	};
	
	$scope.ShowHelpCmd = function (){
		if($scope.ShowHelp)
		{
			$scope.HelpText = "Show Help";
		    $scope.ShowHelp = false;
		}
		else
		{
			$scope.HelpText = "Hide Help";
		    $scope.ShowHelp = true;
		}
	};
	
	$scope.Stop = function (){
		sendMessage({ 'data' : 'stop'});
	};
	
	var sendMessage = function(message){
		if($scope.ChatStatus == "Connected")
		{		
	         console.log("sending:" + message.data);
             var mycroft_data = '{"utterances": ["' + message.data + '"]}'
             var mycroft_msg = '{"type": "recognizer_loop:utterance", "data": ' + mycroft_data + '}'
             socket.send(mycroft_msg);
		}
		else
		{
			$scope.ChatStatus = "Cannot send message. No Connection";
		}
	};
	
	$scope.Submit = function(){
	    sendMessage({data: $scope.ChatText});   
	    $scope.ChatText = "";
	};
	
})