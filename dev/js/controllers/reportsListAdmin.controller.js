(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('reportsListAdminController', reportsListAdminController);

    reportsListAdminController.$inject = ['$scope', 'UserService', 'RestService'];

    function reportsListAdminController($scope, UserService, RestService) {

        var vm = this;
        vm.name = "reportsListAdminController";
        vm.reportsList = [];

        $scope.$on('$viewContentLoaded', onViewContentLoaded);

        function onViewContentLoaded() {
            loadReportsList();
        }

        function loadReportsList() {
            RestService.get("/report")
                .then(function (reports) {
                vm.reportsList = reports.data;

                /* Get the name of the user who reported the request */
                angular.forEach(vm.reportsList, function(report, key){
                    UserService.loadUser(report.user_id)
                        .then(function (user) {
                        vm.reportsList[key].user_name = user.first_name + " " + user.last_name;
                    });
                })

                /* Get the name of the repoted request */
                var data = {id:vm.reportsList.request_id};
                console.log(vm.reportsList);
                RestService.get("/request", data)
                    .then(function (request) {
                    console.log("REQUEST :: ", request);
                })

                console.log(vm.reportsList);
            })
        }

    }
})();
