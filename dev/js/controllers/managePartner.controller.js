(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('managePartnerController', managePartnerController);

    managePartnerController.$inject = ['$scope', 'UserService', 'RestService'];

    function managePartnerController($scope, UserService, RestService) {
        /* jshint validthis: true */
        var vm = this;
        vm.name = "managePartnerController";
        vm.partnersList = [];
        vm.filterQuery = "";
        vm.isFiltered = false;
       

        vm.selectPartner = selectPartner;
        vm.deletePartner = deletePartner;
        vm.addPoints = addPoints;

        $scope.$on('$viewContentLoaded', onViewContentLoaded);

        function onViewContentLoaded() {
            loadPartnersList();
        }

        function loadPartnersList() {
            RestService.get("/admin/partners")
                .then(function (partners) {
                vm.partnersList = partners.data;
                _reloadSelectedPartner();
                console.log(vm.name , ":: Partners loaded");
            }).catch(function (ret) {
                console.log(vm.name , " :: Error ", ret.data.error);
            });
        }

        function selectPartner(partner) {
            vm.selectedPartner = partner;
           
        }

        function deletePartner() {
            RestService.delete("/partner", {id: vm.selectedPartner.id})
                .then(function(data){
                console.log(vm.name, ":: Partner deleted");
                loadPartnersList();
            }).catch(function(ret){
                console.log(vm.name, ":: Error ", ret.data.message);
            });
        }

        function addPoints() {
            if (vm.points) {
                var obj = {
                    "partner_id": vm.selectedPartner.id,
                    "points": vm.points + vm.selectedPartner.points
                }
                RestService.post('/partner/points', obj)
                    .then(function(data){
                    console.log(vm.name, ":: ", vm.points, " added");
                    loadPartnersList();
                }).catch(function(ret){
                    console.log(vm.name, ":: Error ", ret.data.message);
                });


            }
        }
        
        function _reloadSelectedPartner() {
            angular.forEach(vm.partnersList, function(value){
                if (value.id === vm.selectedPartner.id){
                    vm.selectedPartner = value;
                }
            })
        }

    }

})();
