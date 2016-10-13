(function() {
    'use strict';

    angular
        .module('umannityApp.directives')
        .directive('umannityHeader', umannityHeader);

    function umannityHeader() {
        var directive = {
            template: '' +
            '<div ng-if="!vm.user" style="background-color:red"> Not Logged </div>' +
            '<div ng-if="vm.user.group == 0" style="background-color:blue"> Not Admin </div>' +
            '<div ng-if="vm.user.group > 0" style="background-color:green">  Admin </div>'
        };

        return directive;
    }
})();