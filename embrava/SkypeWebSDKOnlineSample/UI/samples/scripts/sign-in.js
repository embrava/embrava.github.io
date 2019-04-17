//sign in sample:
//if user has signed in give prompt, otherwise go to index page
$(function () {
    'use strict';
    window['sign-in_load'] = function () {
        if (window.skypeWebApp && window.skypeWebApp.signInManager.state() == "SignedIn") {
            $('.wrappingdiv .signed-in').show();
            return;
        } else {
            $('.wrappingdiv .signed-in').hide();
            $('.modal').show();
            testForConfigAndSignIn({
                "client_id": "e129a76c-918e-4efe-9b90-7c3a8ec1bbd7",
                "origins": ["https://webdir.online.lync.com/autodiscover/autodiscoverservice.svc/root"],
                "cors": true,
                "version": 'SkypeOnlinePreviewApp/1.0.0',
                "redirect_uri": '/token.html'
            });
        }
        function signin(options) {
            window.skypeWebApp.signInManager.signIn(options).then(function () {
                // when the sign in operation succeeds display the user name
                $(".modal").hide();
                console.log('Signed in as ' + window.skypeWebApp.personsAndGroupsManager.mePerson.displayName());
                if (!window.skypeWebApp.personsAndGroupsManager.mePerson.id()
                    && !window.skypeWebApp.personsAndGroupsManager.mePerson.avatarUrl()
                    && !window.skypeWebApp.personsAndGroupsManager.mePerson.email()
                    && !window.skypeWebApp.personsAndGroupsManager.mePerson.displayName()
                    && !window.skypeWebApp.personsAndGroupsManager.mePerson.title()) {
                    window['noMeResource'] = true;
                }
                $("#anonymous-join").addClass("disable");
                $(".menu #sign-in").click();
                //listenForConversations();
            }, function (error) {
                // if something goes wrong in either of the steps above,
                // display the error message
                $(".modal").hide();
                alert("Can't sign in, please check the user name and password.");
                console.log(error || 'Cannot sign in');
            });
        }
        function testForConfigAndSignIn(options) {
            Skype.initialize({
                    apiKey: config.apiKeyCC
                }, function (api) {
                    window.skypeWebApp = api.UIApplicationInstance;
                    window.skypeApi = api;
                    window.skypeWebAppCtor = api.application;
                    signin(options);
                }, function (err) {
                    console.log(err);
                });
        }
    };
});
