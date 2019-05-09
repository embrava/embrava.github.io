/* 
*   NOTE: This sample uses ES6.
*/
import clientIDs from './clientIDs.js';

let clientApp = {};

// PureCloud OAuth information
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;
// const redirectUri = "http://localhost:3000/";
const redirectUri = "https://embrava.github.io/genesys/embrava_premium_client_app2/";

// API instances
const usersApi = new platformClient.UsersApi();
const notificationsApi = new platformClient.NotificationsApi();
const analyticsApi = new platformClient.AnalyticsApi();
const routingApi = new platformClient.RoutingApi();

var accessToken = null;
var requestParams = new Object();
var basePath = null;
var environment = null;

clientApp.checkForEmbravaConnect = function() {
    var requestParams1 = new Object();
    requestParams1.parameter1_Type = "CheckForECPresence";
    requestParams1.parameter1 = "CheckForECPresence";

    try {
        $.ajax({
            type: "GET",
            data: JSON.stringify(requestParams1),
            url: "http://localhost:9053",
            dataType: "jsonp",
            success: successCallback1,
            error: errorCallback1
        });
    } catch (e) {
        console.log("Exception:" + e);
    }
};

function successCallback1(data) {
    console.log("successCallback1 data:" + data);
};

function errorCallback1(data) {
    console.log("errorCallback1 status:" + data.status);
    console.log("errorCallback1 statusText:" + data.statusText);

    if (data.status == 404) {
        window.location.href="ec-not-running.html";
    }
};

// Will Authenticate through PureCloud
clientApp.setup = function(pcEnv, langTag, html){
    let clientId = clientIDs[pcEnv] || clientIDs['mypurecloud.com'];
    clientApp.langTag = langTag;

    // Authenticate via PureCloud
    client.setPersistSettings(true);
    client.loginImplicitGrant(clientId, redirectUri + html, { state: "state" })
    .then(data => {
        console.log(data);
        
        if (data != null) {
            accessToken = data.accessToken;
			basePath = client.basePath;
			environment = client.environment;
            var appActiveSignalInterval = setInterval(sendAccessTokenAsHeartBeat, 5000);
        }
        // Get Details of current User and save to Client App
        return usersApi.getUsersMe();
    }).then( userMe => {
        clientApp.userId = userMe.id;

        // Create a Notifications Channel
        return notificationsApi.postNotificationsChannels();
    }).then(data => {
        clientApp.websocketUri = data.connectUri;
        clientApp.channelID = data.id;
        clientApp.socket = new WebSocket(clientApp.websocketUri);
        clientApp.socket.onmessage = clientApp.onSocketMessage;
    }).then(
        data => console.log("Succesfully set-up Client App.")
    )

    // Error Handling
    .catch(e => console.log(e));
};

// Handler for every Websocket message
clientApp.onSocketMessage = function(event){
    let data = JSON.parse(event.data);
    let topic = data.topicName;
    let eventBody = data.eventBody;

    console.log(topic);
    console.log(eventBody);    
};

window.onbeforeunload = function () {		
    
    return;
}; 

window.onunload = function () {
    
    return;
};
	
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
};

function sendAccessTokenAsHeartBeat() {
    console.log("Access Token:" + accessToken);

    if (accessToken != null) {
        requestParams.parameter1_Type = "AccessToken";
        requestParams.parameter1 = accessToken;
		
		requestParams.parameter2_Type = "ApiBaseUrl";
        requestParams.parameter2 = basePath;
		
		requestParams.parameter3_Type = "Environment";
        requestParams.parameter3 = environment;
		
        $.ajax({
            type: "GET",
            data: JSON.stringify(requestParams),
            url: "http://localhost:9052",
            dataType: "jsonp"
        });
    }
};

export default clientApp
