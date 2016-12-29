(function() {
    'use strict';

    angular
        .module('umannityApp.directives')
        .directive('uRequestsList', umannityRequestsList);

    function umannityRequestsList() {
        var directive = {
            templateUrl:  'js/directives/requestsList/requestsList.html'
        };
        return directive;
    }
})();