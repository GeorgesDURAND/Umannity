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
        vm.changeStep = changeStep;
        vm.subscribe = subscribe;
        vm.closeAlert = closeAlert;
        
        vm.now = new Date();
        vm.dateMax = new Date(
            vm.now.getFullYear() - 13,
            vm.now.getMonth(),
            vm.now.getDate());
        vm.dateMin = new Date(
            vm.now.getFullYear() - 100,
            vm.now.getMonth(),
            vm.now.getDate());
        
        vm.step = 2;
        vm.cgv = false;
        vm.tmp = {};
        vm.tmp.birthdate = new Date(
            vm.now.getFullYear() - 18,
            vm.now.getMonth(),
            vm.now.getDate());
        vm.tmp.cropImage = '';
        vm.confirmPwd = "";
        vm.errors = [];
        
        vm.newUser = {};
        vm.newUser.zipcode = 0;
        vm.newUser.skills = [];
        vm.newUser.sex = -1;
        
        
        
        function changeView(viewName) {
            $location.path(viewName);
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

        function subscribe() {
            if (checkInfo() === false) {
                vm.errors = [];
                
                vm.newUser.birthdate = new Date(vm.tmp.birthdate).getTime() / 1000;
                vm.newUser.picture = vm.tmp.cropImage;
                
                console.log("New User = ",vm.newUser);
                
                RestService.put("/user", vm.newUser)
                    .then(function(data) {
                    console.log(vm.name, " :: New user created");
                    addAlert('SUCCESSSUBSCRIBE');
                }).catch(function(ret) {
                    addAlert(ret.data.error);
                });
            }
        }

        function changeStep(index) {
            console.log(vm.dateMin, " et ", vm.dateMax);
            if (checkInfo() === false) {
                vm.step = index;
            }
        }

        function checkInfo() {
            if (vm.newUser.first_name && vm.newUser.last_name && vm.newUser.email && vm.newUser.password && vm.confirmPwd) {
                if (vm.newUser.password !== vm.confirmPwd) {
                    addAlert('BADCONFIRMPWD');
                    vm.step = 0;
                    return true;
                }
            } else {
                addAlert('ALLCHAMPFILL');
                vm.step = 0;
                return true;
            }
            vm.errors = [];
            return false;
        }
    }
})();