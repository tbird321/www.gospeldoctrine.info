//Seperate App for menu Widget
var editApp = angular.module('editApp', ['webApi', 'models']);
editApp.factory('editFactory', function () {
    var factory = [];
    var webApi = angular.module('webApi');
    factory.saveContent = function ($scope, editorId, contentHtml, basePath, filename) {
        webApi.SaveContent($scope, editorId, contentHtml, basePath, filename);
        $('#' + editorId).trigger('ExitEdit.webApp');
        $('[data-control-id="' + editorId + '"').show();
    }
    return factory;
});
if (editAppControllers == undefined) {
    var editAppControllers = {};
}
editAppControllers.EditorController = function ($scope, editFactory) {
    init();
    function init() {
        setupContainers();
        setupEditor();
    }
    function getQSParm(param) {
        var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < url.length; i++) {
            var urlparam = url[i].split('=');
            if (urlparam[0] == param) {
                return urlparam[1];
            }
        }
    }
    function setupContainers() {
        $scope.loadedByQS = false;
        $scope.clickbyQS = function () {
            if ($scope.loadedByQS == false) {
                setTimeout(function () {
                    var LessonId = getQSParm('PageId');
                    $('#' + LessonId).click();
                }, 150);
            }
        };
        $scope.htmlLoaded = function (containerId) {
            var webApi = angular.module('webApi');
            var container = $('#' + containerId);
            container.bind('Edit.webApp', enterEditMode);
            container.bind('ExitEdit.webApp', exitEditMode);
            var selector = "div[data-control-id='" + containerId + "']";
            $(selector).unbind('click.webApp');
            $(selector).bind('click.webApp', toggleEditMode);
            var final = container.attr('data-final');
            if ($scope.loadedByQS == false) {
                $scope.clickbyQS();
                $scope.loadedByQS = true;
            }
            if (final = 'true') {
                $scope.$root.MetaKey = $scope.MetaKey;
                $(document).trigger('clientScript.Loaded');
                $(document).trigger('modifyMetaData');
            }
        };
        $scope.setupInitial = function (include, src, filename) {
            setTimeout(function () {
                $scope.CenterInclude = include ;
                $scope.CenterPath = src;
                $scope.CenterFilename = filename;
                $scope.$apply();
            });
        };
    }
    function setupEditor() {
        CKEDITOR.plugins.add('CloseBtn', {
            init: function (editor) {
                editor.addCommand('stopEditing', {
                    exec: function (editor) {
                        $('#' + editor.name).trigger('ExitEdit.webApp');
                        $('[data-control-id="' + editor.name + '"').show();
                    }
                });
                editor.ui.addButton('CloseBtn', {
                    label: 'Close',
                    command: 'stopEditing',
                    icon: webApiUrls.BaseSiteURL() + 'images/icons/closebtn.png',
                    toolbar: 'document'
                });
            }
        });
        CKEDITOR.plugins.add('InlineSave', {
            init: function (editor) {
                editor.addCommand('saveDocument', {
                    exec: function (editor) {
                        var container = $('#' + editor.name);
                        var basePath = container.attr('data-src-path');
                        var filename = container.attr('data-filename');
                        var contentHtml = editor.getData();
                        saveContent(editor.name, contentHtml, basePath, filename);
                    }
                });
                editor.ui.addButton('InlineSave', {
                    label: 'SaveDocument',
                    command: 'saveDocument',
                    icon: 'save',
                    toolbar: 'document'
                });
            }
        });
        CKEDITOR.config.extraPlugins = 'CloseBtn,InlineSave';
        //alert(CKEDITOR.config.toolbar);
        //Todo determine how to use Templates effectively//
        CKEDITOR.config.toolbar = [
    { name: 'document', items: ['CloseBtn', 'InlineSave', 'Source', '-', 'NewPage', 'DocProps', 'Preview', 'Print', '-', 'Templates'] },
    { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
    { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker', 'Scayt'] },
    { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
    { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'] },
    { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
    { name: 'insert', items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
    { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
    { name: 'colors', items: ['TextColor', 'BGColor'] },
    { name: 'tools', items: ['Maximize', 'ShowBlocks'] }
        ];
        CKEDITOR.config.enterMode = CKEDITOR.ENTER_BR;
        CKEDITOR.config.extraAllowedContent = 'div(*);button(*);*(*);*{*};*[id];*[data-*]';
    }
    function toggleEditMode(event) {
        var container = $(event.target);
        var editorId = container.attr('data-control-id');
        var editorObj = $('#' + editorId);
        if (editorObj.hasClass('editMode')) {
            editorObj.trigger('ExitEdit.webApp');
            container.html('Click to Edit');
        }
        else {
            editorObj.trigger('Edit.webApp');
            container.hide();
        }
    }
    function enterEditMode(event) {
        var container = $(event.target);
        if (!container.hasClass('editMode')) {
            var id = container.attr('id');
            container.addClass('editMode');
            container.attr('contenteditable', 'true');
            showEditor(id);
        }
    }
    function showEditor(id) {
        //clear include scope - no binding on content being brought in
        var container = $('#' + id);
        //container.removeAttr('data-ng-include');
        container.find('.ng-scope').removeClass('ng-scope');
        var options = {
            filebrowserBrowseUrl: webApiUrls.FileBrowseURL() + '?appURL=' + webApiUrls.AppUrl(),
            filebrowserUploadUrl: webApiUrls.FileUploadURL() + '?appURL=' + webApiUrls.AppUrl()
        };

        var editor = CKEDITOR.replace(id, options);
        /*editor = CKEDITOR.inline(id, {
            on: {
                blur: function (event) {
                    $('#'+event.editor.name).trigger('ExitEdit.webApp');
                    $('[data-control-id="' + event.editor.name + '"').show();
                }
            }
        });*/
    }
    function exitEditMode(event) {
        var container = $(event.target);
        if (container.hasClass('editMode')) {
            var id = container.attr('id');
            var editor = CKEDITOR.instances[id];
            setTimeout(function () {
                CKEDITOR.instances[editor.name].destroy();
            }, 50);
        }
        container.removeClass('editMode');
        container.removeAttr('contenteditable');
    }
    function saveContent(editorId, contentHtml, basePath, filename) {
        var container = $('#' + editorId);
        var basePath = container.attr('data-src-path');
        if (basePath.indexOf('$') != -1) {
            basePath = eval(basePath);
        }
        var filename = container.attr('data-filename');
        if (filename.indexOf('$') != -1) {
            filename = eval(filename);
        }

        editFactory.saveContent($scope, editorId, contentHtml, basePath, filename);
    }
};
editAppControllers.EditorController.$inject = ['$scope', 'editFactory'];
editApp.controller(editAppControllers);

