(function() {
    'use strict';

    angular
        .module('umannityApp.directives')
        .directive('uChart', umannityChart);

    function umannityChart() {
        var directive = {
            templateUrl:  'js/directives/chart/chart.html'
        };
        return directive;
    }
})();