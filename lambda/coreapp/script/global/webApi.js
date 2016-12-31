var webApiSecurity = angular.module('webApiSecurity', []);
var webApi = angular.module('webApi', ['webApiSecurity', 'webApiUrls']);
$.support.cors = true;
webApi.DevUrl = true;
webApi.DevApiUrl = true;
webApi.UseFiles = true;
webApi.GetDataFile = function ($scope,scopeVar,pathURL) {
    var webUrls = angular.module('webApiUrls');
    if (webApi.UseFiles) {
         $.ajax({
            url: webApiUrls.BaseSiteURL() +pathURL,
            dataType: 'JSON',
            type: 'GET',
            asynch:true,
            success: function (data) {
                eval(scopeVar + '= data');
                $scope.$apply();
            }
         });
    }
}
webApi.GetMenu = function ($scope) {
    var webUrls = angular.module('webApiUrls');
    if (webApi.UseFiles) {
        $.ajax({
            url: webUrls.MenuDataFile,
            dataType: 'JSON',
            type: 'GET',
            success: function (data) {
                $scope.$apply(function () {
                    $scope.menu = data;
                })
            }
        });
    }
    else {
        $.ajax({
            url: webUrls.MenuApiURL(),
            dataType: 'JSON',
            callback: 'getMenu',
            crossdomain: true,
            type: 'GET',
            success: function (data) {
                $scope.$apply(function () {
                    $scope.menu = data;
                })
            }
        });
    }
}
webApi.SaveContent = function ($scope, editorId, contentHtml, basePath, filename) {
    var webUrls = angular.module('webApiUrls');
    var appURL = webUrls.AppUrl;
    var user = JSON.parse($.cookie("user"));
    $.ajax({
        url: webUrls.SaveContentURL(),
        data: { editorId: editorId, contentHtml: contentHtml, basepath: basePath, filename: filename, appUrl: appURL, authtoken: user.AuthToken },
        dataType: 'JSON',
        type: 'POST',
        success: function (data) {
            if (data == 'Success') {
                alert('Conent saved');
            }
            else {
                alert('There was a problem saving your content! - Please logout/login to confirm authentication');
            }
        },
        error: function (data) {
            alert('error occured');
        }
    });
}
webApi.CurrentUser = function () {
    var user = JSON.parse($.cookie("user"));
    returnuser;
}
webApi.IsAdminMode = function () {
    var isAdmin = false;
    if ($.cookie("user") != undefined && $.cookie("user") != null) {
        var user = JSON.parse($.cookie("user"));
        if (user != null && user != undefined) {
            if (user.Authenticated) {
                isAdmin = true;
            }
        }
    }
    return isAdmin;
}
webApi.Login = function ($scope,credentials) {
    var d = new Date();
    var webUrls = angular.module('webApiUrls');
    var appURL = webUrls.AppUrl();
    user = {
        UserName: credentials.username,
        Password: credentials.password,
        Roles: '',
        Authenticated: false,
        AuthData: d.getTime(),
        AuthToken: '',
        AppUrl:appURL
    };
    var date = new Date();
    var minutes = 30;
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    $.cookie("user", JSON.stringify(user), { expires: date });

    var webUrls = angular.module('webApiUrls');
    var appURL = webUrls.LoginURL();
    $.ajax({
        url: appURL,
        data: user,
        dataType: 'JSON',
        asynch:false,
        type: 'POST',
        success: function (userInfo) {
            userInfo.Password = '';
            var date = new Date();
            var minutes = 30;
            date.setTime(date.getTime() + (minutes * 60 * 1000));
            $.cookie("user", JSON.stringify(userInfo), { expires: date });
            $scope.setAuthentication(userInfo);
        },
        error: function (userInfo) {
            alert('errorlogin');
        }
    });
}
webApi.Logout = function ($scope) {
    if ($.cookie("user") != undefined && $.cookie("user") != null) {
        var currentUser = JSON.parse($.cookie("user"));
    }
    if (currentUser != null && currentUser != undefined) {
        var webUrls = angular.module('webApiUrls');
        var appURL = webUrls.LogoutURL();
        $.ajax({
            url: appURL,
            data: currentUser,
            asynch: false,
            dataType: 'JSON',
            type: 'POST',
            success: function (userInfo) {                
                $.cookie("user", JSON.stringify(userInfo));
                $scope.setAuthentication(userInfo);
            },
            error: function (userInfo) {
                alert('error occured');
            }
        });
    } else {
        $scope.setAuthentication(null);
    }
}

