(function () {
    var ws = window.webSocket = window.webSocket || {};
  
    var serverUrl = 'ws://52.34.170.97:8001';

    var _connection;
    var _connected = false;
    var _buffer = [];

    var _loginCommand;
    var _loggedIn = false;

    var _disposed = false;
	
    $(document).ready(function () {
        connect()
    });

    ws.send = function send(cmd) {
        console.log("writing: " + cmd);

        if (_loggedIn) {
            _connection.send(cmd);
        }
        else {
            _buffer.push(cmd);
        }
    };

    ws.setLoginCommand = function webSocket$setLoginCommand(command) {
        _loginCommand = command;

        if (_connected) {
            _connection.send(_loginCommand);
            _loggedIn = true;
            flushBuffer();
        }
    };

    ws.endSession = function webSocket$endSession() {
        _disposed = true;
        if (_connection)
        {
            try{
                _connection.close();
            } catch (e) {}
        }
    };

    function connect() {
        if (_disposed) {
            return;
        }

        try {
            _connection = new WebSocket(serverUrl);
            //_connection.binaryType = "arraybuffer";

            _connection.onopen = onOpen;
            _connection.onmessage = onMessage;
            _connection.onclose = onClose;
            _connection.onerror = onError;
        }
        catch (e) {
            setTimeout(connect, 10000);
        }
    }

    function onOpen() {
        _connected = true;

		/*	use later, when login is implemented
        if (_loginCommand)
        {
            _connection.send(_loginCommand);
            _loggedIn = true;
            flushBuffer();
        }
		*/
		_loggedIn = true;
		flushBuffer();
    }

    function onError(e) {
        console.log("inside web socket:<onError>");
        _connected = false;
        _loggedIn = false;
    }

    function onClose(e) {
        console.log("inside web socket:<onClose>");
        _connected = false;
        _loggedIn = false;
        setTimeout(connect, 10000);
    }

    function onMessage(message) {
		//	when message comes back from server
        console.log("inside web socket: message: " + message);
		
		//	message callback if anyone is listening
		if(ws.messageCallback)
		{
			ws.messageCallback(message.data);
		}
    }

    function flushBuffer() {
        if (_connected) {
            console.log("Flushing buffer");
            for (var i = 0; i < _buffer.length; i++) {
                _connection.send(_buffer[i]);
            }
            _buffer = [];
        }
    }

}());