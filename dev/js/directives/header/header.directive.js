(function() {
    'use strict';

    angular
        .module('umannityApp.directives')
        .directive('uHeader', umannityHeader);

    function umannityHeader() {
        var directive = {
            templateUrl:  'js/directives/header/header.html',
        };
        return directive;
    }
})();