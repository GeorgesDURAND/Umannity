(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('createPartnerAdminController', createPartnerAdminController);

    createPartnerAdminController.$inject = ['$scope', 'UserService', 'RestService'];

    function createPartnerAdminController($scope, UserService, RestService, $translate) {
        /* jshint validthis: true */
        var vm = this;
        vm.name = "createPartnerAdminController";
        vm.newPartner = {};
        vm.newPartner.max_offers = 1;
        vm.tmp = {};
        vm.tmp.cropImage = '';
        vm.errors = [];
        vm.success = false;
        vm.partnerCreated = '';
        
        vm.createPartner = createPartner;
        vm.closeAlert = closeAlert;
        
        function addAlert(error) {
            if (vm.errors.indexOf(error) === -1) {
                if (vm.errors.length >= 4) {
                    vm.errors.splice(0, 1);
                }
                vm.errors.push(error);
            }
        }

        function closeAlert(index) {
            vm.errors.splice(index, 1);
        }
        
        function createPartner () {
            vm.newPartner.image = vm.tmp.cropImage;
            RestService.put('/partner', vm.newPartner)
                .then(function(data) {
                console.log("createPartner :: New partner created.");
                vm.success = true;
                vm.partnerCreated = vm.newPartner.name;
                vm.errors = [];
            })
            .catch (function(data) {
                addAlert(data.data.error);
            });
        }
    }
})();