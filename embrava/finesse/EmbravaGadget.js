var finesse = finesse || {};
finesse.gadget = finesse.gadget || {};
finesse.container = finesse.container || {};
clientLogs = finesse.cslogger.ClientLogger || {};

finesse.modules = finesse.modules || {};
finesse.modules.EmbravaGadget = (function ($) {
    var user, states, dialogs, clientlogs, reasonCodesDict;
	var embravaConnectURL = "http://localhost:8081/";
	var incomingCallState = "INCOMING_CALL";
	var logout = "LOGOUT";
	var debug = true;

    /**
     * Populates the fields in the gadget with data
     */
    updateState = function (currentState) {
		var notReadyReason = '';
		if (currentState == states.NOT_READY) {
			var notReadyReasonCodeId = user.getNotReadyReasonCodeId();
			if (typeof notReadyReasonCodeId !== "undefined") {
				notReadyReason = reasonCodesDict[user.getNotReadyReasonCodeId()];
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
		var prettyAgentStateJson = JSON.stringify(agentStateJson, undefined, 4);
		sendToEmbravaConnect(prettyAgentStateJson);
		if (debug) {
			$('#debugConsole').val(function(i, text) {
				return prettyAgentStateJson + '\n' + text;
			});
		}
    },

     
    /**
     * Handler for the onLoad of a User object. This occurs when the User object is initially read
     * from the Finesse server. Any once only initialization should be done within this function.
     */
    handleUserLoad = function (userevent) {
        updateState(user.getState());
		
		dialogs = user.getDialogs( {
            onCollectionAdd : handleNewDialog
        });

    },
      
    /**
     *  Handler for all User updates
     */
    handleUserChange = function(userevent) {
        updateState(user.getState());
    },

    /**
     *  Handler for additions to the Dialogs collection object. This will occur when a new
     *  Dialog is created on the Finesse server for this user.
     */
    handleNewDialog = function(dialog) {
        updateState(incomingCallState);
    };
	
	/**
     *  Handler for get all Not Ready Reason Codes
     */
	handleNotReadyReasonCodesSuccess = function(reasonCodes) {
		reasonCodesDict = [];
		for(var i = 0; i < reasonCodes.length; i++) {
			var reasonCode = reasonCodes[i];
			if (reasonCode.hasOwnProperty('id') && reasonCode.hasOwnProperty('label')) {
				reasonCodesDict[reasonCode.id] = reasonCode.label
			}
		}
     }
	 
	 /**
	 *	Send Agent State to Embrava Connect
	 */
	function sendToEmbravaConnect(message) {
		$.ajax({
			type: "POST",
			url: embravaConnectURL,
			data: JSON.stringify({ Message: message }),
			contentType: "application/json; charset=utf-8",
			dataType: "jsonp"
		});
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
            var cfg = finesse.gadget.Config;

            clientLogs = finesse.cslogger.ClientLogger;  // declare clientLogs

            gadgets.window.adjustHeight();

            // Initiate the ClientServices and load the user object. ClientServices are
            // initialized with a reference to the current configuration.
            finesse.clientservices.ClientServices.init(cfg, false);

            // Initiate the ClientLogs. The gadget id will be logged as a part of the message
            clientLogs.init(gadgets.Hub, "EmbravaGadget");

            user = new finesse.restservices.User({
                id: cfg.id, 
                onLoad : handleUserLoad,
                onChange : handleUserChange
            });

            states = finesse.restservices.User.States;
            
			user.getNotReadyReasonCodes({
				success: handleNotReadyReasonCodesSuccess
			});
			
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