export default {
    clientIDs: {
        'mypurecloud.com': '0b4127c4-6bd7-47a2-b9a2-e0fe274da287',
        'mypurecloud.ie': '1f2a0023-5d6d-4768-b39c-5093cf08a019',
        'mypurecloud.com.au': 'a4349805-198e-406e-9e7a-14b48e6cdb9e',
		'mypurecloud.de': '5b4f9571-1f45-4569-bce2-1b8bb47f480d'
    },
    "redirectUri": "https://embrava.github.io/genesys/embrava_premium_client_app2/wizard/index.html",
    
    //Permissions required for running the Wizard App
    "setupPermissionsRequired": ['admin'],

    // To be added to names of PureCloud objects created by the wizard
    //"prefix": "STATUS_LIGHTS_FOR_PURECLOUD_",
    "prefix": "Status Lights for PureCloud ",
    "prefixAppName": "Status Lights",
}