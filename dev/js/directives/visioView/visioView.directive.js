(function() {
    'use strict';

    angular
        .module('umannityApp.directives')
        .directive('uMainView', umannityMainView);

    function umannityMainView(){
        var directive = {
            templateUrl:  'js/directives/mainView/mainView.html',
            transclude: true
        };
        return directive;
    }
})();