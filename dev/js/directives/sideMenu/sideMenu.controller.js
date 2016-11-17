(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('sideMenuController', sideMenuController);

    sideMenuController.$inject = ['$scope', '$location', 'UserService', 'RestService'];

    function sideMenuController($scope, $location, UserService, RestService) {
        /* jshint validthis: true */
        var vm = this;

        vm.name = "sideMenuController";
        vm.logout = logout;
        vm.changeView = changeView;
        vm.isCollapsed = false;
        vm.user = UserService.getUser();

        $scope.$on('$viewContentLoaded', onViewContentLoaded);

        ////

        function logout() {
            UserService.logout();
            $location.path("/login");
        }

        function changeView(viewName) {
            $location.path(viewName);
        }

        function onViewContentLoaded() {
            if (undefined === vm.user){
                RestService.loadUser()
                    .then(function (user){
                    vm.user = user;
                })
                    .catch(function (error){
                    console.log(error);
                });
            }
        }

    }
})();