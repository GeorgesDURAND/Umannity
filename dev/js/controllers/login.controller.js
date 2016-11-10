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
        vm.changeView = changeView;
        vm.name = "loginController";
        vm.closeAlert = closeAlert;
        vm.errors = [];

        ////

        function changeView(viewName) {
            $location.path(viewName);
        }
        
        function closeAlert(index) {
            vm.errors.splice(index, 1);
        }

        function login() {
            //TODO: Verifications on the mail and password
            UserService.login(vm.email, vm.password)
                .then(function (user) {
                console.log($location.path() + " && " + user);
                if($location.path() === "/loginPartner" && user === "partner") {
                    console.log(vm.name + ":: Partner connected");
                    $location.path("/");
                }else if ($location.path() === "/login" && user === "user")  {
                    console.log(vm.name + ":: User connected");
                    $location.path("/");
                }else {
                    console.log(vm.name + ":: Wrong connexion");
                    vm.errors.push('WRONG_CONNEXION');
                }
            })
                .catch(function (error) {
                console.log(error);
                vm.errors.push(error.data.code);
            });
        }
    }
})();