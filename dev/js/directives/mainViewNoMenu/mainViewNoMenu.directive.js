(function() {
    'use strict';

    angular
        .module('umannityApp.directives')
        .directive('uMainViewNoMenu', umannityMainViewNoMenu);

    function umannityMainViewNoMenu(){
        var directive = {
            templateUrl:  'js/directives/mainViewNoMenu/mainViewNoMenu.html',
            transclude: true
        };
        return directive;
    }
})();