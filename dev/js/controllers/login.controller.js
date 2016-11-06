(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('loginController', loginController);

    loginController.$inject = ['$location', 'UserService'];

    function loginController($location, UserService) {
        /* jshint validthis: true */
        var vm = this;

        vm.login = login;
        vm.name = "loginController";

        ////

        function login() {
            //TODO: Verifications on the mail and password
            UserService.login(vm.email, vm.password)
                .then(function (user) {
                    $location.path("/");
                })
                .catch(function (error) {
                    //TODO: Proper error management
                    if (error.data) {
                        if (error.data.error) {
                            window.alert(error.data.error);
                        }
                        else {
                            console.log(error.data);
                        }
                    }
                });
        }
    }
})();