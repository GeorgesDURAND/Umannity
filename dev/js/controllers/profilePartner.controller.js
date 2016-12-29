(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('profilePartnerController', profilePartnerController);

    profilePartnerController.$inject = ['$scope', 'PartnerService', '$q'];

    function profilePartnerController($scope, PartnerService, $q) {
        /* jshint validthis: true */
        var vm = this;
        vm.edited_partner = {};
        vm.errors = [];
        vm.editProfilePicture = editProfilePicture;
        vm.editProfile = editProfile;
        vm.goEdit = true;

        $scope.$on('$viewContentLoaded', onViewContentLoaded);

        function onViewContentLoaded() {
            //Loading the user
//            vm.partner = UserService.getUser();partnerpartner
//            if (undefined === vm.user) {partnerpartner
            loadPartner();
        }

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

        function loadPicture(id) {
            PartnerService.loadPicture(id)
                .then(function (picture) {
                    vm.partner.picture = picture;
                });
        }

        function loadPartner(id) {
            /*if (undefined !== id) {
                vm.hideButtonEdit = true
            }
            else {
                vm.hideButtonEdit = false
            }*/
            PartnerService.loadPartner(id)
                .then(function (partner) {
                    vm.partner = partner;
                    loadPicture(vm.partner.id);
                });
        }

        function editPassword() {
            PartnerService.login(vm.partner.email, vm.edited_partner.old_password)
                .then(function (partner) {
                    vm.edited_partner.password = vm.edited_partner.new_password;
                    PartnerService.editProfile(vm.edited_partner)
                        .then(function (partner) {
                            vm.edited_partner = undefined;
                            loadPartner();
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
        
        function checkPassword() {
            var deferred = $q.defer();
            if (undefined !== vm.edited_partner.old_password && undefined !== vm.edited_partner.new_password &&
                undefined !== vm.edited_partner.confirm_new_password) {
                if (vm.edited_partner.new_password !== vm.edited_partner.confirm_new_password) {
                    addAlert('ERROR_NO_SAME_PASSWORD');
                }
                PartnerService.login(vm.partner.email, vm.edited_partner.old_password)
                    .then(function (partner) {
                        vm.edited_partner.password = vm.edited_partner.new_password;
                        deferred.resolve(partner);
                    })
                    .catch(function (error) {
                        deferred.reject(error);
                    });
            }
            console.log("deferred.promise.........", deferred.promise);
            return deferred.promise;
        }

        function editProfile() {
            if (undefined !== vm.edited_partner) {
                if (undefined !== vm.edited_partner.old_password && undefined !== vm.edited_partner.new_password &&
                    undefined !== vm.edited_partner.confirm_new_password) {
                    checkPassword()
                        .then(function (partner) {
                            if (undefined !== vm.edited_partner) {
                                PartnerService.editProfile(vm.edited_partner)
                                    .then(function (partner) {
                                        loadPartner();
                                        vm.edited_partner = undefined;
                                    })
                                    .catch(function (error) {
                                        addAlert(error.data.error);
                                    });
                            }
                        })
                        .catch(function (error) {
                            addAlert(error.data.error);
                            console.log("error editProfile Partner ........", error);
                        });
                }
                else {
                    PartnerService.editProfile(vm.edited_partner)
                        .then(function (partner) {
                            loadPartner();
                            vm.edited_partner = undefined;
                        })
                        .catch(function (error) {
                            addAlert(error.data.error);
                        });
                }
            }
        }

        function editProfilePicture(picture) {
            if (undefined !== picture) {
                vm.edited_partner.image = picture;
                PartnerService.editProfile(vm.edited_partner)
                    .then(function () {
                        loadPartner();
                    });
            }
            else {
                console.log("editProfilePicture in profile controller: picture undefined");
            }
        }
    }
})();