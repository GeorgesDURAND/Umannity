(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('subscribeUserController', subscribeUserController);

    subscribeUserController.$inject = ['$location', 'UserService', 'RestService'];

    function subscribeUserController($location, UserService, RestService) {
        /* jshint validthis: true */
        var vm = this;
        vm.name = 'subscribeUserController' ;
        vm.changeView = changeView;
        
        vm.step = 0;
        
       /* $scope.$on('$viewContentLoaded', onViewContentLoaded);
        
        function onViewContentLoaded() {
           vm.step = 0;
        }*/
        
        function changeView(viewName) {
            $location.path(viewName);
        }

        
        function click() {
            console.log(vm.name);
        }
    }
})();