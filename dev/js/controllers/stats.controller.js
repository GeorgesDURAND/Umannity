(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('statsController', statsController);

    statsController.$inject = ['$scope', 'UserService', 'RestService'];

    function statsController($scope, UserService, RestService) {
        /* jshint validthis: true */
        var vm = this;
        var _stats_routes = ["/users", "/requests", "/offers"];

        vm.name = "statsController";

        $scope.$on('$viewContentLoaded', onViewContentLoaded);

        ////

        function onViewContentLoaded() {
            vm.user = UserService.getUser();
            console.log(vm.name + " :: content loaded");
            if (undefined === vm.charts) {
                console.log(vm.name + " :: no charts loaded, downloading charts...");
                getCharts();
            }
        }

        function parseData(data) {
            console.log(vm.name + " :: parsing data", data);
            if (typeof undefined !== data.data.charts) {
                if (undefined === vm.charts) {
                    vm.charts = [];
                }
                angular.forEach(data.data.charts, function(chart) {
                    vm.charts.push(chart);
                });
            }
        }

        function getCharts() {
            angular.forEach(_stats_routes, function (route) {
                console.log(vm.name + " :: calling route", route);
                RestService.get("/stats" + route)
                    .then(function (data) {
                        parseData(data);
                    })
                    .catch(function (error) {
                        window.alert(error.data);
                    });
            });
        }
    }
})();
