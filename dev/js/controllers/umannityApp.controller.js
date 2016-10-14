(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('umannityAppController', umannityAppController);

    umannityAppController.$inject = ['$location', 'UserService'];

    function umannityAppController($location, UserService) {
        /* jshint validthis: true */
        var vm = this;

        ////

        function checkUser() {
            var user = UserService.get_user();
            var api_key = UserService.get_api_key();

            if (null === api_key) {
                console.log("umannityAppController :: User is not logged");
                $location.path("/login");
            }
            else if (null === user) {
                console.log("umannityAppController :: User is logged and its data isn't loaded");
                UserService.load_user()
                    .then(function (user) {
                        console.log("umannityAppController :: User loaded");
                        vm.user = user;
                    })
                    .catch(function (error) {
                        //TODO: Proper error management
                        window.alert(error);
                    });
            }
            else {
                vm.user = user;
                console.log("umannityAppController :: User is logged and has data", user);
            }
        }

        checkUser();
    }

})();