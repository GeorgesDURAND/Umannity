(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('statsController', statsController);

    statsController.$inject = ['$scope', 'UserService', 'RestService'];

    function statsController($scope, UserService, RestService) {
        /* jshint validthis: true */
        var vm = this;
        var _stats_routes = ["/users"];

        vm.name = "statsController";

        $scope.$on('$viewContentLoaded', onViewContentLoaded);

        ////

        function onViewContentLoaded(){
            vm.user = UserService.getUser();
            console.log("statsController :: content loaded");
            if (undefined === vm.charts) {
                console.log("statsController :: no charts loaded, downloading charts...");
                getCharts();
            }
        }

        function parseData(data) {
            if (typeof undefined !== data.data.charts) {
                if (undefined === vm.charts) {
                    vm.charts = [];
                }
                vm.charts = angular.extend(vm.charts, data.data.charts);
            }
        }

        function getCharts() {
            angular.forEach(_stats_routes, function (route) {
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