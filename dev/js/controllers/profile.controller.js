(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('profileController', profileController);

    profileController.$inject = ['$scope', 'UserService', '$translate', '$q', '$routeParams'];

    function profileController($scope, UserService, $translate, $q, $routeParams) {
        /* jshint validthis: true */
        var vm = this;

        vm.editProfile = editProfile;
        vm.editProfilePicture = editProfilePicture;
        vm.closeAlert = closeAlert;
        vm.otherUser = otherUser;

        vm.errors = [];
        vm.edited_user = {};
        vm.tmp = {};
        vm.tmp.cropImage = '';
        vm.hide_element = false;
        vm.goEdit = true;
        vm.isUser = true;
        vm.birthday = false;

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
            var id = $routeParams.user_id;
            loadUser(id);
        }

        function loadUser(id) {
            if (undefined !== id) {
                vm.isUser = false;
            }
            else {
                vm.isUser = true;
            }
            UserService.loadUser(id)
                .then(function (user) {
                vm.user = user;
                vm.edited_user.sex = vm.user.sex;
                if (vm.user.sex === 0) {
                    vm.user.gender = $translate.instant("WOMAN");
                }
                else {
                    vm.user.gender = $translate.instant("MAN");
                }
                vm.edited_user.skills = vm.user.skills;
                vm.user.age = UserService.getAge(vm.user.birthdate);
                loadPicture(id);
            });
        }

        //Loading the picture
        function loadPicture(id) {
            UserService.loadPicture(id)
                .then(function (picture) {
                vm.user.picture = picture;
                vm.tmp.cropImage = picture;
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
                        if (vm.edited_user.new_password === vm.edited_user.confirm_new_password) {
                            vm.edited_user.password = vm.edited_user.new_password;
                        }
                        deferred.resolve(user);
                    })
                    .catch(function (error) {
                    deferred.reject(error);
                });
            }
            console.log("deferred.promise.........", deferred.promise);
            return deferred.promise;
        }

        function editPassword() {
            UserService.login(vm.user.email, vm.edited_user.old_password)
                .then(function (user) {
                    vm.edited_user.password = vm.edited_user.new_password;
                    UserService.editProfile(vm.edited_user)
                        .then(function (user) {
                            vm.edited_user = undefined;
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
                                editProfilePicture();
                                loadUser();
                                vm.edited_user = undefined;
                                vm.edited_user.skills = vm.user.skills;
                                vm.goEdit = true;
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
                        editProfilePicture();
                        loadUser();
                        vm.edited_user.skills = vm.user.skills;
                        vm.goEdit = true;
                    })
                        .catch(function (error) {
                        addAlert(error.data.error);
                    });
                }
            }
        }

        function editProfilePicture() {
            if (undefined !== vm.tmp.cropImage) {
                vm.edited_user.picture = vm.tmp.cropImage;
                UserService.putPicture(vm.edited_user)
                    .then(function () {
                    loadUser();
                }).catch(function(ret) {
                    console.log("editProfilePicture :: Error ", ret.data.messages);
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