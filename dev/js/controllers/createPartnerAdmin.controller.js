(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('createPartnerAdminController', createPartnerAdminController);

    createPartnerAdminController.$inject = ['$scope', 'UserService', 'RestService'];

    function createPartnerAdminController($scope, UserService, RestService, $translate) {

        var vm = this;
        vm.name = "createPartnerAdminController";
        vm.createPartner = createPartner;
        
        function createPartner () {
            console.log(vm.logoPartner);
        }
    }
})();