(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('profileController', profileController);

    profileController.$inject = ['$scope', 'UserService', '$base64'];

    function profileController($scope, UserService) {
        /* jshint validthis: true */
        var vm = this;
        vm.edited_user = {};
        vm.editProfile = editProfile;
        vm.editProfilePicture = editProfilePicture;

        $scope.$on('$viewContentLoaded', onViewContentLoaded);

        function onViewContentLoaded() {
            //Loading the user
            vm.user = UserService.getUser();
            if (undefined === vm.user) {
                loadUser();
            }
        }

        function loadUser() {
            UserService.loadUser()
                .then(function (user) {
                    vm.user = user;
                    loadPicture();
                });
        }

        //Loading the picture
        function loadPicture() {
            UserService.loadPicture()
                .then(function (picture) {
                    vm.user.picture = picture;
                });
        }

        function editProfile() {
            if (undefined !== vm.edited_user) {
                UserService.editProfile(vm.edited_user)
                    .then(function (user) {
                        loadUser();
                    });
            }
        }

        function editProfilePicture(picture) {
            if (undefined !== picture) {
                vm.edited_user.picture = picture;
            }
            else {
                console.log("editProfilePicture in profile controller: picture undefined");
            }
        }
    }
})();
