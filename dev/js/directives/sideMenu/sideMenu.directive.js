(function() {
    'use strict';

    angular
        .module('umannityApp.directives')
        .directive('umannitySideMenu', umannitySideMenu);

    function umannitySideMenu() {
        var directive = {
            templateUrl: 'js/directives/sideMenu/sideMenu.html'
        };
        return directive;
    }
})();