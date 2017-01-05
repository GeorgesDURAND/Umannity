(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('activatePartnerController', activatePartnerController);

    activatePartnerController.$inject = ['$location', 'RestService', '$routeParams'];

    function activatePartnerController($location, RestService, $routeParams) {
        /* jshint validthis: true */
        var vm = this;

        vm.changeView = changeView;
        vm.activePartner = activePartner;
        vm.name = "activatePartnerController";
        vm.message = '';
        vm.IsSubmitted = false;
        vm.errors = [];
        ////

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

        function changeView(viewName) {
            $location.path(viewName);
        }

        function activePartner() {
            console.log("TEST");
            if (!vm.pwd || vm.pwd !== vm.confirm_pwd) {
                addAlert('BADCONFIRMPWD');
            } else {
                vm.IsSubmitted = true;
                vm.message = 'PENDINGACTIVATION';

                var obj = {
                    token : $routeParams.token,
                    password : vm.pwd
                };

                RestService.post('/partner/activate', obj)
                    .then(function(data) {
                    console.log(vm.name, ":: Activation success");
                    vm.message = 'ACTIVATIONSUCCESS';
                    vm.errors = [];
                }).catch(function(ret) {
                    console.log(vm.name, ":: Activation error : ", ret);
                    addAlert(ret.data.error);
                    vm.message = 'ACTIVATIONERROR';
                });
            }
        }
    }
})();