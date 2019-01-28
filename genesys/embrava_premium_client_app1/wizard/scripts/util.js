var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var goToPage = function goToPage(page, langTag, pcEnv) {
    var urlParameterLangTag = getUrlParameter('langTag');
    var urlParameterPcEnvironment = getUrlParameter('environment');

    if (urlParameterLangTag === undefined) {
        urlParameterLangTag = langTag;
    }
    if (urlParameterPcEnvironment === undefined) {
        urlParameterPcEnvironment = pcEnv;
    }

    var pageUrl = urlParameterLangTag ? page + '.html?langTag=' + urlParameterLangTag : page + '.html?langTag=en-us';
    pageUrl = pageUrl + '&' + (urlParameterPcEnvironment ? 'environment=' + urlParameterPcEnvironment : 'environment=mypurecloud.com');

    window.location = pageUrl;
}