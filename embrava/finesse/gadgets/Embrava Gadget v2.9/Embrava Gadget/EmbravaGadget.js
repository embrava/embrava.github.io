var finesse = finesse || {};
finesse.gadget = finesse.gadget || {};
finesse.container = finesse.container || {};
clientLogs = finesse.cslogger.ClientLogger || {};

finesse.gadget.Config = (function () {
	var _prefs = new gadgets.Prefs();
	return {
		authorization: _prefs.getString("authorization"),
		country: _prefs.getString("country"),
		language: _prefs.getString("language"),
		locale: _prefs.getString("locale"),
		host: _prefs.getString("host"),
		hostPort: _prefs.getString("hostPort"),
		extension: _prefs.getString("extension"),
		mobileAgentMode: _prefs.getString("mobileAgentMode"),
		mobileAgentDialNumber: _prefs.getString("mobileAgentDialNumber"),
		xmppDomain: _prefs.getString("xmppDomain"),
		pubsubDomain: _prefs.getString("pubsubDomain"),
		restHost: _prefs.getString("restHost"),
		scheme: _prefs.getString("scheme"),
		localhostFQDN: _prefs.getString("localhostFQDN"),
		localhostPort: _prefs.getString("localhostPort"),
		clientDriftInMillis: _prefs.getInt("clientDriftInMillis")
	};
}());

finesse.modules = finesse.modules || {};
finesse.modules.EmbravaGadget = (function ($) {
    var user, states, dialogs, clientlogs, _dialog;
	var reasonCodesDict = [];
	var incomingCallState = "INCOMING_CALL";

	window.onbeforeunload = function () {		
		updateState("LOGOUT");
		return;
	}; 

	window.onunload = function () {
		updateState("LOGOUT");
		return;
	};

    /**
     * Populates the fields in the gadget with data
     */
    updateState = function (currentState) {
		writeToLog("updateState entry: " + currentState);
		var notReadyReason = '';
		if (currentState == states.NOT_READY) {
			if (typeof user.getReasonCode === "function") {
				var notReadyReasonObject = user.getReasonCode();
				if (notReadyReasonObject !== undefined) {
					if ((notReadyReasonObject.label !== undefined) && (notReadyReasonObject.label != null))
						notReadyReason = notReadyReasonObject.label;
				}
			}
			if (notReadyReason == '') { 
				var notReadyReasonCodeId = user.getNotReadyReasonCodeId();
				if (typeof notReadyReasonCodeId !== "undefined") {
					if(typeof reasonCodesDict[notReadyReasonCodeId] !== 'undefined') {
						notReadyReason = reasonCodesDict[notReadyReasonCodeId];
					} else {
						notReadyReason = "";
						writeToLog("updateState: NotReady ResonCodeList Invalid");
					}
				}
			}
		}
		var userDisplayName = user.getFirstName() + " " + user.getLastName();
		var agentStateJson = {};
		agentStateJson.AgentState = currentState;
		agentStateJson.AgentDisplayName = userDisplayName;
		
		if (notReadyReason != null && notReadyReason != '') {
			agentStateJson.ReasonCode = notReadyReason
		}
		
		var d = new Date();
		timestampStr = (d.getFullYear() + ("0"+(d.getMonth()+1)).slice(-2) + ("0" + d.getDate()).slice(-2) +
								("0" + d.getHours()).slice(-2) + ("0" + d.getMinutes()).slice(-2) +
								("0" + d.getSeconds()).slice(-2) + ("00" + d.getMilliseconds()).slice(-3));
		agentStateJson.TimeStamp = timestampStr;
		agentStateJson.Id = guid();
		
		if (_dialog) {
			var mediaProperties = _dialog.getMediaProperties();
			if (mediaProperties['callType']) {
				agentStateJson.CallType = mediaProperties['callType'];
				writeToLog("updateState agentStateJson.CallType: " + agentStateJson.CallType);
			}
			if (mediaProperties['queueNumber']) {
				agentStateJson.SkillGroupId = mediaProperties['queueNumber']
				writeToLog("updateState agentStateJson.SkillGroupId: " + agentStateJson.SkillGroupId);
			}
			if (mediaProperties['queueName']) {
				agentStateJson.SkillGroupName = mediaProperties['queueName'];
				writeToLog("updateState agentStateJson.SkillGroupName: " + agentStateJson.SkillGroupName);
			}
		}
		
		writeToLog("updateState agentStateJson.AgentState: " + agentStateJson.AgentState);
		writeToLog("updateState agentStateJson.AgentDisplayName: " + agentStateJson.AgentDisplayName);
		writeToLog("updateState agentStateJson.ReasonCode: " + agentStateJson.ReasonCode);
		writeToLog("updateState agentStateJson.TimeStamp: " + agentStateJson.TimeStamp);
		writeToLog("updateState agentStateJson.Id: " + agentStateJson.Id);
		
		var prettyAgentStateJson = JSON.stringify(agentStateJson, undefined, 4);
		
		//var prettyAgentStateJson = encodeURI(JSON.stringify(agentStateJson, undefined, 4)).replace(/#/g, '%23');
		
		writeToLog("updateState prettyAgentStateJson: " + prettyAgentStateJson);
		
		sendToEmbravaConnect(prettyAgentStateJson);
		writeToLog("updateState exit");
		if (debug) {
			$('#debugConsole').val(function(i, text) {
				return prettyAgentStateJson + '\n' + text;
			});
		}
    },
	
	writeToLog = function(logMessage) {
		if (debug == false) {
			return;
		}
		clientLogs.log(logMessage);
	},

	identifyCallEvent = function(dialogState) {
		writeToLog("identifyCallEvent entry - dialogState: " + dialogState);
		if (dialogState == "ALERTING" && user.getState() != "TALKING") {
			writeToLog("identifyCallEvent : incomingCall");
			updateState(incomingCallState);
		} else {
			writeToLog("identifyCallEvent : updatingUserStateToEC: " + user.getState());
			updateState(user.getState());
		}	
		writeToLog("identifyCallEvent exit");
	},
     
	/**
     *  Handler for any changes in the Dialogs collection object.
     */
	handleDialogChange = function (dialog) {
		writeToLog("handleDialogChange entry");
		var dialogState = dialog.getState();		
		identifyCallEvent(dialogState);
		writeToLog("handleDialogChange exit");
    },
	
    /**
     *  Handler for additions to the Dialogs collection object.  This will occur when a new
     *  Dialog is created on the Finesse server for this user.
     */
	handleDialogAdd = function(dialog) {
		writeToLog("handleDialogAdd entry");
		var dialogState = dialog.getState();		
		_dialog = dialog;		
		identifyCallEvent(dialogState);		
		// add a change handler to the dialog
        dialog.addHandler('change', handleDialogChange);
		writeToLog("handleDialogAdd exit");
    },
     
    /**
     *  Handler for deletions from the Dialogs collection object for this user.  This will occur
     *  when a Dialog is removed from this user's collection (example, end call)
     */
    handleDialogDelete = function(dialog) {
		
		writeToLog("handleDialogDelete entry");
		
		updateState(user.getState());
		
		if (dialog.getId() === _dialog.getId()) {
			_dialog = null;
		} else {
		}
		
		writeToLog("handleDialogDelete exit");
    },
	
    /**
     * Handler for the onLoad of a User object. This occurs when the User object is initially read
     * from the Finesse server. Any once only initialization should be done within this function.
     */
    handleUserLoad = function (userevent) {
		
		writeToLog("handleUserLoad entry");
		
		user.getNotReadyReasonCodes({
			success: handleNotReadyReasonCodesSuccess,
			error: handleNotReadyReasonCodesError
		});

        updateState(user.getState());
		
		dialogs = user.getDialogs({
            onCollectionAdd : handleDialogAdd,
            onCollectionDelete : handleDialogDelete
        });
		
		writeToLog("handleUserLoad exit");
	},
      
    /**
     *  Handler for all User updates
     */
    handleUserChange = function(userevent) {
		writeToLog("handleUserChange entry");
        updateState(user.getState());
		writeToLog("handleUserChange exit");
    },
	
	/**
     *  Handler for get all Not Ready Reason Codes
     */
	handleNotReadyReasonCodesSuccess = function(reasonCodes) {
		writeToLog("handleNotReadyReasonCodesSuccess entry");
		reasonCodesDict = [];
		for(var i = 0; i < reasonCodes.length; i++) {
			var reasonCode = reasonCodes[i];
			if (reasonCode.hasOwnProperty('id') && reasonCode.hasOwnProperty('label')) {
				reasonCodesDict[reasonCode.id] = reasonCode.label
				writeToLog("handleNotReadyReasonCodesSuccess reasonCode.label: " + reasonCode.label);
			}
		}
		writeToLog("handleNotReadyReasonCodesSuccess exit");
     },

	 /**
     *  Error handler for get all Not Ready Reason Codes
     */
	 handleNotReadyReasonCodesError = function(error) {
		writeToLog("handleNotReadyReasonCodesError entry");
		writeToLog("handleNotReadyReasonCodesError error message: " + JSON.stringify(error));
		writeToLog("handleNotReadyReasonCodesError exit");
	 }
	 
	 /**
	 *	Send Agent State to Embrava Connect
	 */
	function sendToEmbravaConnect(message) {
		writeToLog("sendToEmbravaConnect entry");
		var jsonMessage;
		jsonMessage = JSON.stringify({ Message: message });
		jsonMessage = encodeURIComponent(jsonMessage);
		writeToLog("jsonMessage: " + jsonMessage);
		$.ajax({
			type: "POST",
			url: embravaConnectURL,
			data: jsonMessage,
			contentType: "application/json; charset=utf-8",
			dataType: "jsonp"
		});
		writeToLog("sendToEmbravaConnect exit");
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

    /** @scope finesse.modules.EmbravaGadget */
    return {

        /**
         * Performs all initialization for this gadget
         */
        init : function () {
			var prefs =  new gadgets.Prefs();
			var id = prefs.getString("id");

			// Initiate the ClientLogs. The gadget id will be logged as a part of the message
            clientLogs = finesse.cslogger.ClientLogger;  // declare clientLogs
			clientLogs.init(gadgets.Hub, "EmbravaGadgetLog");

            // Initiate the ClientServices and load the user object. ClientServices are
            // initialized with a reference to the current configuration.
            finesse.clientservices.ClientServices.init(finesse.gadget.Config);

			states = finesse.restservices.User.States;
			
            user = new finesse.restservices.User({
                id: id, 
                onLoad : handleUserLoad,
                onChange : handleUserChange
            });

			gadgets.window.adjustHeight();
			
            // Initiate the ContainerServices and add a handler for when the tab is visible
            // to adjust the height of this gadget in case the tab was not visible
            // when the html was rendered (adjustHeight only works when tab is visible)
            containerServices = finesse.containerservices.ContainerServices.init();
            containerServices.addHandler(finesse.containerservices.ContainerServices.Topics.ACTIVE_TAB, function() {
                clientLogs.log("Gadget is now visible");  // log to Finesse logger
                // automatically adjust the height of the gadget to show the html
                gadgets.window.adjustHeight();
            });
            containerServices.makeActiveTabReq();
        }
    };
}(jQuery));