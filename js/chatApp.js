var app = angular.module('ChatApp',[]);
app.controller('ChatController', function ($scope){
    $scope.ConnectionIP = "mycroft.lackey.io";    
	$scope.ShowHelp = false;
	$scope.HelpText = "Show Help";
	$scope.Responses = [];
	$scope.ChatText = "";
	$scope.ChatStatus = "Not Connected";
	
	//var response = {data: {utterance:"HelloWord"},type:"local",classText:"btm-left-in"};
	//var response2 = {data: {utterance:"Hello to you too"},type:"remote",classText:"btm-right-in"};
	//var response3 = {data: {utterance:"Sooo what's happening?"},type:"local",classText:"btm-left-in"};
	//var response4 = {data: {utterance:"Not much just chillin"},type:"remote",classText:"btm-right-in"};
	//$scope.Responses.push(response);
	//$scope.Responses.push(response2);
	//$scope.Responses.push(response3);
	//$scope.Responses.push(response4);
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
		        response.type = "remote";
				response.classText = "btm-right-in";
				$scope.Responses.push(response);	
                $scope.$apply();				
			}
		}
		
		socket.onclose = function(){
            $scope.ChatStatus = "Not Connected";
  		    console.log("disconnected"); 
			$scope.$apply();
        };      		
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
		sendMessage("stop");
	};
	
	var sendMessage = function(message){
		if($scope.ChatStatus == "Connected")
		{	var response = {data: {utterance:message},type:"local",classText:"btm-left-in"};
             $scope.Response.push(response);	
	         console.log("sending:" + message);			 
             var mycroft_data = '{"utterances": ["' + message + '"]}'
             var mycroft_msg = '{"type": "recognizer_loop:utterance", "data": ' + mycroft_data + '}'
             socket.send(mycroft_msg);
		}
		else
		{
			$scope.ChatStatus = "Cannot send message. No Connection";
		}
	};
	
	$scope.Submit = function(){
	    sendMessage($scope.ChatText);   
	    $scope.ChatText = "";
	};
	
})