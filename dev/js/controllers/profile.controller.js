(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('profileController', profileController);

    profileController.$inject = ['$scope', 'UserService'];

    function profileController($scope, UserService) {
        var vm = this;
        $scope.$on('$viewContentLoaded', onViewContentLoaded);

        function onViewContentLoaded() {
            vm.user = UserService.getUser();
            vm.picture = UserService.getPicture();
            if (undefined === vm.picture) {
                UserService.loadPicture()
                    .then(function (picture) {
                        vm.picture = picture;
                    })
                    .catch(function (error){
                        console.log(error)
                    });
            }

            console.log(vm.name + " :: content loaded");
            console.log(vm.user);
            console.log(vm.picture);
        }
    }
})();
