(function () {
    var sn = window.samNet = window.samNet || {};
	var ws = window.webSocket = window.webSocket || {};

	var inputField;
	var samButton;
	var outputs;
	
    $(document).ready(function () {
        inputField = $("#inputField");
		samButton = $("#samButton");
		outputs = $("#outputs");
    
		samButton.click(function(){
			sendText();
		});
		
		//	message data is passed to this function as parameter
		ws.messageCallback = function(message){
            //  eliminate script tags
            message.replace("<script>","");
            message.replace("</script>","");
            
			outputs.prepend("<div>" + message + "</div><br/>");			
		}
	});	
	
	function sendText(){
			var input = inputField.val();
			inputField.val("");
			
			//	send to server
			ws.send(input);
			setTimeout(function(){
			inputField.val("");
			}, 0);
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
	
}());