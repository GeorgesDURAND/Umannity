(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('loginPartnerController', loginPartnerController);

    loginPartnerController.$inject = ['$location', 'UserService'];

    function loginPartnerController($location, UserService) {
        /* jshint validthis: true */
        var vm = this;

        vm.login = login;
        vm.changeView = changeView;
        vm.name = "loginPartnerController";

        ////
        
        function changeView(viewName) {
            $location.path(viewName);
        }

        function login() {
            //TODO: Verifications on the mail and password
            UserService.login(vm.email, vm.password)
                .then(function (user) {
                    $location.path("/");
                })
                .catch(function (error) {
                    //TODO: Proper error management
                    window.alert(error.data.error);
                });
        }
    }
})();