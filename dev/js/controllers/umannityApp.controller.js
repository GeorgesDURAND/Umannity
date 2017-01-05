(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('umannityAppController', umannityAppController);

    umannityAppController.$inject = ['$location', 'UserService', 'RestService', 'PartnerService'];

    function umannityAppController($location, UserService, RestService, PartnerService) {
        /* jshint validthis: true */
        var vm = this;
        var appVm = vm;

        appVm.getIsLoading = getIsLoading;
        appVm.getUser = UserService.getUser;
        appVm.getPartner = PartnerService.getPartner;
        vm.name = "umannityAppController";

        ////

        function getIsLoading() {
            return RestService.getIsLoading();
        }

        function checkUser() {
            //var api_key = UserService.getApiKey();
            var api_key = RestService.getApiKey();
            console.log("umannityAppController :: Api Key", api_key);
            var user = UserService.getUser();
            var partner = PartnerService.getPartner();

            if (undefined === api_key) {
                console.log("umannityAppController :: User is not logged");
                if ($location.path() === "/loginPartner") {
                    $location.path("/loginPartner");
                } else if ($location.path() === "/cgv") {
                    $location.path("/cgv");
                } else if ($location.path() === "/subscribe") {
                    $location.path("/subscribe");
                } else if ($location.path().slice(9) === "/activate") {
                    console.log("Activate");
                } else if ($location.path().slice(16) === "/activatePartner") {
                    console.log("ActivatePartner");
                } else {
                    $location.path("/login");
                }
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