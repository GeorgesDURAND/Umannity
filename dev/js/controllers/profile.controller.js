(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('profileController', profileController);

    profileController.$inject = ['$scope', 'UserService', '$translate', '$q'];

    function profileController($scope, UserService, $translate, $q) {
        /* jshint validthis: true */
        var vm = this;
        vm.edited_user = {};
        vm.editProfile = editProfile;
        vm.editProfilePicture = editProfilePicture;
        vm.errors = [];
        vm.closeAlert = closeAlert;
        vm.hide_element = false;
        vm.otherUser = otherUser;
        vm.goEdit = true;
        vm.hideButtonEdit = false;

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
//            vm.user = UserService.getUser();
//            if (undefined === vm.user) {
                loadUser();
        }

        function loadUser(id) {
            if (undefined !== id) {
                vm.hideButtonEdit = true;
            }
            else {
                vm.hideButtonEdit = false;
            }
            UserService.loadUser(id)
                .then(function (user) {
                    vm.user = user;
                    if (vm.user.sex === 0) {
                        vm.user.gender = $translate.instant("WOMAN");
                    }
                    else {
                        vm.user.gender = $translate.instant("MAN");
                    }
                    loadPicture(id);
                });
        }

        //Loading the picture
        function loadPicture(id) {
            UserService.loadPicture(id)
                .then(function (picture) {
                    vm.user.picture = picture;
                });
        }

        function checkPassword() {
            var deferred = $q.defer();
            if (undefined !== vm.edited_user.old_password && undefined !== vm.edited_user.new_password &&
                undefined !== vm.edited_user.confirm_new_password) {
                if (vm.edited_user.new_password !== vm.edited_user.confirm_new_password) {
                    addAlert('ERROR_NO_SAME_PASSWORD');
                }
                UserService.login(vm.user.email, vm.edited_user.old_password)
                    .then(function (user) {
                        vm.edited_user.password = vm.edited_user.new_password;
                        deferred.resolve(user);
                    })
                    .catch(function (error) {
                        deferred.reject(error);
                    });
            }
            console.log("deferred.promise.........", deferred.promise);
            return deferred.promise;
        }

        function editProfile() {
            if (undefined !== vm.edited_user) {
                if (undefined !== vm.edited_user.address) {
                    vm.edited_user.address = vm.edited_user.address.name;
                }
                //Check user enter a birthdate
                if (null !== vm.edited_user.birthdateDateFormat) {
                    vm.edited_user.birthdate = new Date(vm.edited_user.birthdateDateFormat).getTime() / 1000;
                }
                if (undefined !== vm.edited_user.old_password && undefined !== vm.edited_user.new_password &&
                    undefined !== vm.edited_user.confirm_new_password) {
                    checkPassword()
                        .then(function (user) {
                            if (undefined !== vm.edited_user) {
                                UserService.editProfile(vm.edited_user)
                                    .then(function (user) {
                                        loadUser();
                                        vm.edited_user = undefined;
                                    })
                                    .catch(function (error) {
                                        addAlert(error.data.error);
                                    });
                            }
                        })
                        .catch(function (error) {
                            addAlert(error.data.error);
                            console.log("error editProfile User ........", error);
                        });
                }
                else {
                    UserService.editProfile(vm.edited_user)
                        .then(function (user) {
                            loadUser();
                            vm.edited_user = undefined;
                        })
                        .catch(function (error) {
                            addAlert(error.data.error);
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

        function otherUser() {
            loadUser(vm.other_user_id);
        }
    }
})();
