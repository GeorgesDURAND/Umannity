(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('umannityAppController', umannityAppController);

    umannityAppController.$inject = ['$location', 'UserService', 'RestService'];

    function umannityAppController($location, UserService, RestService) {
        /* jshint validthis: true */
        var vm = this;
        var appVm = vm;

        appVm.getIsLoading = getIsLoading;
        appVm.getUser = UserService.getUser;
        vm.name = "umannityAppController";

        ////

        function getIsLoading() {
            return RestService.getIsLoading();
        }

        function checkUser() {
            var api_key = UserService.getApiKey();
            console.log("umannityAppController :: Api Key", api_key);
            var user = UserService.getUser();

            if (undefined === api_key) {
                console.log("umannityAppController :: User is not logged");
                if ($location.path() === "/loginPartner") {
                    $location.path("/loginPartner");
                } else if ($location.path() === "/cgv") {
                    $location.path("/cgv");
                } else if ($location.path() === "/subscribe") {
                    $location.path("/subscribe");
                } else {
                    $location.path("/login");
                }
            }
            else if (undefined === user) {
                console.log("umannityAppController :: User is logged and its data isn't loaded");
                UserService.loadUser()
                    .then(function (user) {
                    console.log("umannityAppController :: User loaded");
                    vm.user = user;
                    loadPicture();
                })
                    .catch(function (error) {
                    //TODO: Proper error management
                    console.log(vm.name + ":: Unauthorized user");
                    UserService.logout();
                    $location.path('/login');
                    /*window.alert(error.data.error);*/
                });
            }
            else {
                vm.user = user;
                console.log("umannityAppController :: User is logged and has data", user);
            }
        }

        function loadPicture() {
            UserService.loadPicture()
                .then(function (picture) {
                console.log("umannityAppController :: Picture loaded");
                vm.picture = picture;
            })
                .catch(function (error) {
                window.alert(error);
            });
        }

        if (vm.user === undefined) {
            console.log("umannityAppController :: content loaded");
            checkUser();
        }
    }

})();