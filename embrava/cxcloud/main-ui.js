(function() {


	
    var ui = {		
		buttonAvailable:null,
		buttonUnavailable:null,
		buttonBusy:null,
		buttonOffline:null,
		buttonIncomingCall:null,
		buttonOnCall:null,
		buttonIncomingChat:null,
		buttonOnChat:null
	};
	
	var embravaConnectURL = "https://localhost:8446/";
	var userDisplayName = "John Peters"
	var jsonMessage = "";
	
	// Update UI
	var initializeWindow = function() {
		console.log("initializeWindow is called");
	  
		for (var k in ui) {
		  var id = k;
		  
		  var element = document.getElementById(id);
		  if (!element) {
			  throw "Missing UI element: " + k;
			}
			ui[k] = element;		
		}
		
		ui.buttonAvailable.addEventListener('click', onButtonAvailableClicked);
		ui.buttonUnavailable.addEventListener('click', onButtonUnavailableClicked);
		ui.buttonBusy.addEventListener('click', onButtonBusyClicked);
		ui.buttonOffline.addEventListener('click', onButtonOfflineClicked);
		ui.buttonIncomingCall.addEventListener('click', onButtonIncomingCallClicked);
		ui.buttonOnCall.addEventListener('click', onButtonOnCallClicked);
		ui.buttonIncomingChat.addEventListener('click', onButtonIncomingChatClicked);
		ui.buttonOnChat.addEventListener('click', onButtonOnChatClicked);
	};

	window.addEventListener('load', initializeWindow);

    // Add Device button click event
	var onButtonAvailableClicked = async function() {
		console.log("onButtonAvailableClicked");
		try {
			updateState("available", "none");
		}
		catch (err) {
			console.log("Exception: " + err);
		}
	};
	
	var onButtonUnavailableClicked = async function() {
		console.log("onButtonUnavailableClicked");
		try {
			updateState("Unavailable", "none");
		}
		catch (err) {
			console.log("Exception: " + err);
		}
	};
	
	var onButtonBusyClicked = async function() {
		console.log("onButtonBusyClicked");
		try {
			updateState("busy", "none");
		}
		catch (err) {
			console.log("Exception: " + err);
		}
	};
	
	var onButtonOfflineClicked = async function() {
		console.log("onButtonOfflineClicked");
		try {
			updateState("offline", "none");
		}
		catch (err) {
			console.log("Exception: " + err);
		}
	};
	
	var onButtonIncomingCallClicked = async function() {
		console.log("onButtonIncomingCallClicked");
		try {
			updateState("available", "Incoming Call");
		}
		catch (err) {
			console.log("Exception: " + err);
		}
	};
	
	var onButtonOnCallClicked = async function() {
		console.log("onButtonOnCallClicked");
		try {
			updateState("available", "On Call");
		}
		catch (err) {
			console.log("Exception: " + err);
		}
	};
	
	var onButtonIncomingChatClicked = async function() {
		console.log("onButtonIncomingChatClicked");
		try {
			updateState("available", "Incoming Chat");
		}
		catch (err) {
			console.log("Exception: " + err);
		}
	};
	
	var onButtonOnChatClicked = async function() {
		console.log("onButtonOnChatClicked");
		try {
			updateState("available", "On Chat");
		}
		catch (err) {
			console.log("Exception: " + err);
		}
	};
	
	updateState = function (currentPresenceState, currentCallState) {		
		var agentStateJson = {};
		agentStateJson.AgentPresenceState = currentPresenceState;
		agentStateJson.AgentDisplayName = userDisplayName;
		agentStateJson.AgentCallState = currentCallState;		
		
		var d = new Date();
		timestampStr = (d.getFullYear() + ("0"+(d.getMonth()+1)).slice(-2) + ("0" + d.getDate()).slice(-2) +
								("0" + d.getHours()).slice(-2) + ("0" + d.getMinutes()).slice(-2) +
								("0" + d.getSeconds()).slice(-2) + ("00" + d.getMilliseconds()).slice(-3));
								
		agentStateJson.TimeStamp = timestampStr;
		
		agentStateJson.Id = guid();
		
		jsonMessage = JSON.stringify(agentStateJson, undefined, 4);
		
		console.log("jsonMessage: "  + jsonMessage);
		
		sendToEmbravaConnect(jsonMessage);
    }
	
	function sendToEmbravaConnect(message) {
		try {
			$.ajax({
			type: "POST",
			url: embravaConnectURL,
			data: message,
			contentType: "application/json; charset=utf-8",
			dataType: "jsonp",
			complete: function (xhr, status) {
				if (status === 'error') {
					// Error
					console.log("status: error");
					
					// may retry sending the request again.
				} else { 					
					console.log("status: success");
				}			
			}				
			});
		} catch (err) {
			console.log("Exception in sendToEmbravaConnect: "  + err);
		}
	}
	
	/**
	*	Generate unique guid
	*/
	function guid() {
		return "ss-s-s-s-sss".replace(/s/g, s4);
	}

	/**
	*	Used for guid generation
	*/
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	}
	
}());