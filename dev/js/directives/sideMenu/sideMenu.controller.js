(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('sideMenuController', sideMenuController);

    sideMenuController.$inject = ['$scope', '$location', 'UserService', 'RestService', 'PartnerService'];

    function sideMenuController($scope, $location, UserService, RestService, PartnerService) {
        /* jshint validthis: true */
        var vm = this;

        vm.name = "sideMenuController";
        vm.logout = logout;
        vm.changeView = changeView;
        vm.isCollapsed = false;
        vm.user = UserService.getUser();
        vm.partner = PartnerService.getPartner();

        vm.adminSubmenu = false;

        $scope.$on('$viewContentLoaded', onViewContentLoaded);

        ////

        function logout() {
            if (undefined !== vm.user) {
                UserService.logout();
            }
            if (undefined !== vm.partner) {
                PartnerService.logout();
            }
            $location.path("/login");
        }

        function changeView(viewName) {
            $location.path(viewName);
        }

        function onViewContentLoaded() {
            // if (undefined === vm.user){
            //     RestService.loadUser()
            //         .then(function (user){
            //         vm.user = user;
            //     })
            //         .catch(function (error){
            //         console.log(error);
            //     });
            // }
        }
    }
})();