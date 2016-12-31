//Seperate App for admin Widget
var adminApp = angular.module('adminApp', ['webApi', 'models']);
adminApp.factory('adminFactory', function () {
    var factory = [];
    var webApi = angular.module('webApi');
    factory.login = function ($scope, credentials) {
        webApi.Login($scope, credentials);
    }
    factory.logout = function ($scope) {
        webApi.Logout($scope);
    }
    factory.IsAuthenticated = function () {
        var user = webApi.CurrentUser();
        if (user == undefined) {
            return false;
        } else {
            return true;
        }
    }
    factory.IsAuthorized = function (autorizedRoles) {

    }
    return factory;
});
adminApp.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
})
adminApp.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
})

if (adminAppControllers == undefined) {
    var adminAppControllers = {};
}
adminAppControllers.AdminController = function ($scope, $rootScope, AUTH_EVENTS, adminFactory) {
    $scope.setAuthentication = function (user) {        
        if (user!=null && user.Authenticated == true) {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $('.adminMode').show();
            $('#loginMenu').addClass('hide');
            $('#logoutMenu').removeClass('hide');
            $('.adminMode').show();
        }
        else {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            $('.editMode').trigger('ExitEdit.webApp');
            $('.adminMode').hide();
            $('#loginMenu').removeClass('hide');
            $('#logoutMenu').addClass('hide');
        }
    };    
    $scope.credentials = {
        username: '',
        password: ''
    };
    $scope.logout = function () {
        adminFactory.logout($scope);
    };
    
    $scope.login = function (credentials) {
        $('#loginModal').modal('toggle');
        $('#password').val('');
        adminFactory.login($scope, credentials);
    };
    function logout(event) {
        adminFactory.logout($scope);
    }
    init();
    function init() {
        $('#loginModal').bind('logout', logout);
    }
};
adminAppControllers.AdminController.$inject = ['$scope', '$rootScope', 'AUTH_EVENTS', 'adminFactory'];
adminApp.controller(adminAppControllers);
adminApp.directive('adminSetup', function () {//Run after everything is loaded - setup admin status
    return {
        link: function ($scope, element, attrs) {
            setTimeout(function () {
                var options = { hoverDelay: 100, delay: 100 };
                $('[data-hover="dropdown"]').dropdownHover(options);
                var webApi = angular.module('webApi');
                if (webApi.IsAdminMode()) {
                    $('.adminMode').show();
                    $('#loginMenu').addClass('hide');
                    $('#logoutMenu').removeClass('hide');
                }
                else {
                    $('.adminMode').hide();
                    $('#loginMenu').removeClass('hide');
                    $('#logoutMenu').addClass('hide');
                }
            }, 200);
        }
    };
});