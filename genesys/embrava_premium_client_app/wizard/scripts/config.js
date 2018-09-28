export default {
    clientIDs: {
        'mypurecloud.com': 'e93d91c6-481d-4238-835d-566c425aab46'
        //'mypurecloud.ie': '8233c135-c488-427c-b301-158b164f2e4d',
        //'mypurecloud.com.au': '173ed139-b09c-4189-b206-97ef3dce4d16'
    },
    "redirectUri": "https://embrava.github.io/genesys/embrava_premium_client_app/wizard/index.html",
    //"redirectUri": "https://localhost/wizard/index.html",

    //Permissions required for running the Wizard App
    "setupPermissionsRequired": ['admin'],

    // To be added to names of PureCloud objects created by the wizard
    "prefix": "EMBRAVA_STATUS_LIGHTS_FOR_PURECLOUD_",
}