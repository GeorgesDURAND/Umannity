(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('statsController', statsController);

    statsController.$inject = ['$scope', 'UserService'];

    function statsController($scope, UserService) {
        /* jshint validthis: true */
        var vm = this;

        vm.name = "statsController";

        $scope.$on('$viewContentLoaded', onViewContentLoaded);

        ////

        function onViewContentLoaded(){
            vm.user = UserService.getUser();
            console.log("statsController :: content loaded");
        }
    }
})();