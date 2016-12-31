//Seperate App for menu Widget
var menuApp = angular.module('menuApp', ['webApi']);
menuApp.factory('menuFactory', function () {
    var factory = [];
    var webApi = angular.module('webApi');
    factory.getMenu = function ($scope) {       
        webApi.GetMenu($scope);
    }
    factory.getLeftSideBar = function ($scope, contentId) {
        var containerDiv = $('#' + contentId);
        var pathUrl = containerDiv.attr('data-src');
        webApi.GetDataFile($scope,'$scope.leftSideBar', pathUrl);
    }
    return factory;
});
if (menuAppControllers == undefined) {
    var menuAppControllers = {};
}
menuAppControllers.MenuController = function ($scope,$sce, menuFactory) {
    $scope.menu = [];
    $scope.fire_jscript = function (script) {
        eval(script);
    }
    init();
    function init() {
        $scope.menu = menuFactory.getMenu($scope);
        $scope.isMobile = function()
        {
            if (navigator.userAgent.match(/Android/i))
            {
                return true;
            }
            if (navigator.userAgent.match(/iPhone | iPad | iPod/i))
            {
                return true;
            }
        }
    }
    $scope.dropdown = function (menuItem) {
        if (menuItem.ChildItems != undefined) {
            if (menuItem.ChildItems.length > 0) {
                return "dropdown";
            }
            else {
                return "";
            }
        }
        else {
            return "";
        }
    }
    $scope.dropdownclass = function (menuItem) {
        if (menuItem.ChildItems != undefined) {
            if (menuItem.ChildItems.length > 0) {
                return "dropdown-toggle";
            }
            else {
                return "";
            }
        }
        else {
            return "";
        }
    }
    $scope.hasChildren = function (menuItem) {
        if (menuItem.ChildItems.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
};
menuAppControllers.MenuController.$inject = ['$scope', '$sce', 'menuFactory'];

menuAppControllers.LeftSideBarController = function ($scope, $sce, menuFactory,$element) {
    $scope.leftSideBar = [];
    init($element[0].parentElement.id);
    $scope.clickLink = function (srcItem) {
        $scope.$parent.$parent.CenterInclude = srcItem.FullPath;
        $scope.$parent.$parent.CenterPath = srcItem.Path;
        $scope.$parent.$parent.CenterFilename = srcItem.Filename;
        $scope.$parent.$parent.MetaKey = srcItem.MetaKey;
        $('htlm, body').animate({ scrollTop: $('#centerContent').offset().top }, "slow");
        ga('set', 'page', srcItem.FullPath);
    }
    function init(divId) {
        menuFactory.getLeftSideBar($scope, divId);       
    }
};
menuAppControllers.LeftSideBarController.$inject = ['$scope', '$sce', 'menuFactory','$element'];

menuApp.controller(menuAppControllers);
