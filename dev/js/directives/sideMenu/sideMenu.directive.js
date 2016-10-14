(function() {
    'use strict';

    angular
        .module('umannityApp.directives')
        .directive('uSideMenu', umannitySideMenu);

    function umannitySideMenu() {
        var directive = {
            templateUrl: 'js/directives/sideMenu/sideMenu.html',
            controller: 'sideMenuController',
            controllerAs: 'vm'
        };
        return directive;
    }
})();