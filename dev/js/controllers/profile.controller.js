(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('profileController', profileController);

    profileController.$inject = ['$scope', 'UserService'];

    function profileController($scope, UserService) {
        /* jshint validthis: true */
        var vm = this;
        vm.edited_user = {};
        vm.editProfile = editProfile;
        vm.editProfilePicture = editProfilePicture;
        vm.errors = [];
        vm.closeAlert = closeAlert;

        $scope.$on('$viewContentLoaded', onViewContentLoaded);

        function addAlert(error) {
            if (vm.errors.indexOf(error) === -1) {
                if (vm.errors.length >= 4) {
                    vm.errors.splice(0, 1);
                }
            vm.errors.push(error);
            }
        }

        function closeAlert(index) {
            vm.errors.splice(index, 1);
        }

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
                //Check user enter a birthdate, if not set to undefined
                if (0 === vm.edited_user.birthdateDateFormat) {
                    vm.edited_user.birthdateDateFormat = undefined;
                }
                //Check user enter a birthdate
                if (undefined !== vm.edited_user.birthdateDateFormat) {
                    vm.edited_user.birthdate = new Date(vm.edited_user.birthdateDateFormat).getTime() / 1000;
                }
                //Check user want change password
                if (undefined !== vm.edited_user.old_password && undefined !== vm.edited_user.new_password &&
                    undefined !== vm.edited_user.confirm_new_password) {
                    if (vm.edited_user.old_password.length > 0 && vm.edited_user.new_password.length > 0 &&
                        vm.edited_user.confirm_new_password.length > 0) {
                        if (vm.edited_user.confirm_new_password !== vm.edited_user.new_password) {
                            addAlert('ERROR_NO_SAME_PASSWORD');
                        }
                        else {
                            UserService.login(vm.user.email, vm.edited_user.old_password)
                                .then(function (user) {
                                    vm.edited_user.password = vm.edited_user.new_password;
                                    UserService.editProfile(vm.edited_user)
                                        .then(function (user) {
                                            loadUser();
                                        })
                                        .catch(function (error) {
                                            //TODO: Proper error management
                                            addAlert('ERROR_WRONG_FORMAT_PASSWORD');
                                        });
                                })
                                .catch(function (error) {
                                    //TODO: Proper error management
                                    addAlert('ERROR_WRONG_PASSWORD');
                                });
                        }
                    }
                }
                else {
                    UserService.editProfile(vm.edited_user)
                        .then(function (user) {
                            loadUser();
                        })
                        .catch(function (error) {
                            //TODO: Proper error management
                            addAlert('EDIT_PROFILE_ERROR');
                        });
                }
            }
        }

        function editProfilePicture(picture) {
            if (undefined !== picture) {
                vm.edited_user.picture = picture;
                UserService.putPicture(vm.edited_user)
                    .then(function () {
                        loadUser();
                    });
            }
            else {
                console.log("editProfilePicture in profile controller: picture undefined");
            }
        }
    }
})();