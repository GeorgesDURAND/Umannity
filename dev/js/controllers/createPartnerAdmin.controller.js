(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('createPartnerAdminController', createPartnerAdminController);

    createPartnerAdminController.$inject = ['$scope', 'UserService', 'RestService', '$translate'];

    function createPartnerAdminController($scope, UserService, RestService, $translate) {
        /* jshint validthis: true */
        var vm = this;

        vm.name = "createPartnerAdminController";
    }
})();
