var webApiUrls = angular.module('webApiUrls', []);
webApiUrls.BaseUrl = function () {
    document.location.origin;
}
webApiUrls.BaseSiteURL = function () {
    var webApi = angular.module('webApi');
    var siteURL = '';
    if (!webApi.DevUrl) {
        siteURL = 'http://www.ldsgospeldoctrine.info/';
    }
    else {
        siteURL = 'http://localhost:9116/';
    }
    return siteURL;
}
webApiUrls.BaseApiURL = function () {
    var apiUrl = '';
    var webApi = angular.module('webApi');
    if (!webApi.DevApiUrl) {
        apiUrl = 'http://ec2-54-200-149-234.us-west-2.compute.amazonaws.com/api/';
    }
    else {
        apiUrl = 'http://localhost:52301/api/';
    }
    return apiUrl;
}
webApiUrls.AppUrl = function () {
    var appURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
    return appURL;
}
webApiUrls.MenuApiURL = function () {
    var apiUrl = webApiUrls.BaseApiURL() + 'content/getresults';
    return apiUrl;
}
webApiUrls.SaveContentURL = function () {
    var apiUrl = webApiUrls.BaseApiURL() + 'content/saveContents';
    return apiUrl;
}
webApiUrls.LoginURL = function () {
    var apiUrl = webApiUrls.BaseApiURL() + 'admin/login';
    return apiUrl;
}
webApiUrls.LogoutURL = function () {
    var apiUrl = webApiUrls.BaseApiURL() + 'admin/logout';
    return apiUrl;
}
webApiUrls.FileUploadURL = function () {
    var apiUrl = webApiUrls.BaseApiURL() + 'content/uploadFile';
    return apiUrl;
}
webApiUrls.FileBrowseURL = function () {
    var apiUrl = webApiUrls.BaseApiURL() + 'content/fileBrowser';
    return apiUrl;
}
webApiUrls.MenuDataFile = webApiUrls.BaseSiteURL() + 'data/Menu.json';
