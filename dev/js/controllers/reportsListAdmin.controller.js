(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('reportsListAdminController', reportsListAdminController);

    reportsListAdminController.$inject = ['$scope', 'UserService', 'RestService'];

    function reportsListAdminController($scope, UserService, RestService) {
        /* jshint validthis: true */
        var vm = this;
        vm.name = "reportsListAdminController";
        vm.reportsList = [];
        vm.filterQuery = "";
        vm.isFiltered = false;

        vm.notAReportAnymore = deleteReport;
        vm.deleteItem = deleteItem;

        $scope.$on('$viewContentLoaded', onViewContentLoaded);

        function onViewContentLoaded() {
            loadReportsList();
        }

        function loadReportsList() {
            RestService.get("/report")
                .then(function (reports) {
                vm.reportsList = reports.data;
                angular.forEach(vm.reportsList, function(report, key) {
                    UserService.loadUser(report.user_id)
                        .then(function (user) {
                        vm.reportsList[key].user_name = user.first_name + " " + user.last_name;
                    });
                    vm.reportsList[key].date = UserService.formatBirthdate(vm.reportsList[key].date);
                });
            });
        }

        function deleteItem(item_id, type, report_id) {
            if (type === "request"){
                
                RestService.delete("/request", {request_id:item_id})
                    .then (function (data) {
                    console.log("Request :: correctly deleted");
                    deleteReport(report_id);
                })
                    .catch (function () {
                    console.log("Request :: Error while tempting to delete");   
                });
                
            } else {
                console.log(vm.name , " :: delete ", type, " not handle for the moment");
            }
        }

        function deleteReport(report_id) {
            RestService.delete("/report", {id:report_id})
                .then (function (data) {
                console.log("Report :: correctly deleted");
                _refreshReportList(report_id);
            })
                .catch (function () {
                console.log("Report :: Error while tempting to delete");   
            });
        }

        function _refreshReportList(report_id) {
            angular.forEach(vm.reportsList, function(report, key) {
                if (report.id === report_id) {
                    vm.reportsList.splice(key, 1);
                    console.log("ReportsList :: correctly refreshed");
                }
            });
        }
    }
})();
