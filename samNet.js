(function () {
    var sn = window.samNet = window.samNet || {};
	var ws = window.webSocket = window.webSocket || {};
	var eu = window.encodingUtils = window.encodingUtils || {};
	
	var inputField;
	var samButton;
    var screenNameButton;
	var outputs;
    
    //  divs to show and hide
    var snInputDiv;
    var snButtonDiv;
    var messageInputDiv;
    var sendButtonDiv;
    
    var screenName;
    
    $(document).ready(function () {
        //  get handles to objects on page
        inputField = $("#inputField");
		samButton = $("#samButton");
        screenNameButton = $("#screenNameButton")
        screenNameField = $("#inputSNField")
		outputs = $("#outputs");
    
        snInputDiv = $("#screenNameInputDiv");
        snButtonDiv = $("#screenNameButton");
        messageInputDiv = $("#inputFieldDiv");
        sendButtonDiv = $("#samButtonDiv");
        
		samButton.click(function(){
			sendText();
		});
		
        screenNameButton.click(function(){
			setScreenName();
		});
        
		//	message data is passed to this function as parameter
		ws.messageCallback = function(message){
            message = DOMPurify.sanitize(message);
			//	convert message to binary array
			//message = eu.utf8ArrayToString(message);
            outputs.prepend("<div>" + message + "</div><br/>");			
		}
	});	
	
	function sendText(){
            //  prepend screenname and timestamp to message
            var d = new Date();
			var input = screenName;
            input += " (" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ") - ";
            input += inputField.val();
            
			inputField.val("");
			
			//	convert input to binary stream
			//input = eu.stringToUtf8Array(input);
			
			//	send to server
			ws.send(input);
			setTimeout(function(){
			inputField.val("");
			}, 0);
	}
	
    function setScreenName(){
        screenName = screenNameField.val();
        
        //  hide screenname select div, show messaging divs
        $(snInputDiv).hide();
        $(snButtonDiv).hide();
        
        $(messageInputDiv).show();
        $(sendButtonDiv).show();
        $(outputs).show();
        
        //  Show the current user
        $("#signInState").text("chatting as " + screenName);
    }
    
	//  Pressing enter will submit contents of textarea
	window.onTestChange = function(){
		var key = window.event.keyCode;

		// If the user has pressed enter
		if (key == 13) {
			sendText();
		}
		else {
			return true;
		}	
	}
    
    //  catch enter key events in the screen name entry
    window.screenNameInputListener = function(){
        var key = window.event.keyCode;

		// If the user has pressed enter
		if (key == 13) {
			setScreenName();
		}
		else {
			return true;
		}	
    }
	
}());