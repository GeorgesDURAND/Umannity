(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('umannityAppController', umannityAppController);

    umannityAppController.$inject = ['$scope', '$location', 'UserService'];

    function umannityAppController($scope, $location, UserService) {
        /* jshint validthis: true */
        var vm = this;
        
        vm.name = "umannityAppController";

        $scope.$on('$viewContentLoaded', onViewContentLoaded);

        ////
        
        function checkUser() {
            var api_key = UserService.getApiKey();
            console.log("umannityAppController :: Api Key", api_key);
            var user = UserService.getUser();

            if (undefined === api_key) {
                console.log("umannityAppController :: User is not logged");
                $location.path("/login");
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
                        window.alert(error);
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

        function onViewContentLoaded() {
            if (vm.user === undefined) {
                console.log("umannityAppController :: content loaded");
                checkUser();
            }
        }
    }

})();