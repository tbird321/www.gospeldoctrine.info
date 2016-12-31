//Seperate App for menu Widget
var headerApp = angular.module('headerApp', ['webApi']);
headerApp.factory('headerFactory', function () {
    var factory = [];
    var webApi = angular.module('webApi');
    factory.getHeaderMeta = function ($scope, contentId) {
        var containerDiv = $('#' + contentId);
        var pathUrl = containerDiv.attr('data-src');
        webApi.GetDataFile($scope, '$scope.metaData', pathUrl);
    }
    return factory;
});
if (headerAppControllers == undefined) {
    var headerAppControllers = {};
}

headerAppControllers.MetaTagController = function ($scope, $sce, headerFactory, $element) {
    $scope.MetaKey = 'Home';
    $(document).unbind('modifyMetaData');
    $(document).bind('modifyMetaData', function (event) {
        if ($scope.$parent.$root.metaData != undefined) {
            var result = $scope.$parent.$root.metaData[$scope.$parent.$root.MetaKey];
            if (result != undefined) {
                var title = $('title');
                title.html(result.Title);
                $('meta').remove();
                $(result.MetaTags).each(function (index, element) {
                    title.after('<meta name="' + this.Name + '" content="' + this.Content + '" >');
                });
            }
        }
    });
    init($element[0]);
    function init(control) {
        if (control.id != '') {
            var defaultkey = control.attributes['data-meta-key'].value;
            headerFactory.getHeaderMeta($scope, control.id);
            $scope.$parent.$root.MetaKey = defaultkey;
            $(document).trigger('modifyMetaData');
        }
    }
};
//headerAppControllers.MetaTagController.$inject = ['$scope', '$sce', 'headerFactory', '$element'];

headerApp.controller(headerAppControllers);
