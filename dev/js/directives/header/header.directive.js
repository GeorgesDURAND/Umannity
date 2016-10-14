(function() {
    'use strict';

    angular
        .module('umannityApp.directives')
        .directive('umannityHeader', umannityHeader);

    function umannityHeader() {
        var directive = {
            templateUrl:  'js/directives/header/header.html'
        };
        return directive;
    }
})();