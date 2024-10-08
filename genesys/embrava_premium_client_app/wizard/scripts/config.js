export default {
    clientID: 'e93d91c6-481d-4238-835d-566c425aab46',
    redirectUri: 'https://embrava.github.io/genesys/embrava_premium_client_app/wizard/index.html',	
	  appName: 'premium-app-embrava',
	  premiumAppURL: 'https://embrava.github.io/genesys/embrava_premium_client_app/index.html',
	
    defaultPcEnvironment: 'mypurecloud.com',
    defaultLanguage: 'en-us',
    
    //Permissions required for running the Wizard App
    setupPermissionsRequired: ['admin'],

    viewPermission: 'integration:embravaApps:view',
	
    // To be added to names of PureCloud objects created by the wizard
    //"prefix": "STATUS_LIGHTS_FOR_PURECLOUD_",
    prefix: "Status Lights for PureCloud ",
    prefixAppName: "Status Lights"
}