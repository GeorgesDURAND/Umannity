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
            if (null == UserService.get_api_key()) {
                console.log("umannityAppController :: User is not logged");
                $location.path("/login");
            }
            else if (null === UserService.get_user()) {
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
                console.log("umannityAppController :: User is logged and has data", UserService.get_user());
            }
        }

        checkUser();
    }

})();