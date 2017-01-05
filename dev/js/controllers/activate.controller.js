(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('activateController', activateController);

    activateController.$inject = ['$location', 'UserService', '$routeParams'];

    function activateController($location, UserService, $routeParams) {
        /* jshint validthis: true */
        var vm = this;
        
        vm.changeView = changeView;
        vm.name = "activateController";
        vm.message = '';
        ////

        function changeView(viewName) {
            $location.path(viewName);
        }

        function closeAlert(index) {
            vm.errors.splice(index, 1);
        }

        function activate() {
            UserService.activate($routeParams.token)
                .then(function(data){
                console.log(vm.name, ":: Activation success");
                vm.message = 'ACTIVATIONSUCCESS';
            }).catch(function(ret){
                console.log(vm.name, ":: Activation error : ", ret);
                vm.message = 'ACTIVATIONERROR';
            });
        }
        
        activate();
    }
})();