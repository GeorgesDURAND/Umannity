(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('subscribeUserController', subscribeUserController);

    subscribeUserController.$inject = ['$location', 'UserService', 'RestService', '$timeout'];

    function subscribeUserController($location, UserService, RestService, $timeout) {
        /* jshint validthis: true */
        var vm = this;
        vm.name = 'subscribeUserController' ;
        vm.changeView = changeView;
        vm.changeStep = changeStep;
        vm.subscribe = subscribe;
        vm.closeAlert = closeAlert;

        vm.now = new Date();
        vm.dateMax = _formatDate(vm.now.getFullYear() - 13, vm.now.getMonth() + 1, vm.now.getDate(), "-");
        vm.dateMin = _formatDate(vm.now.getFullYear() - 100, vm.now.getMonth() + 1, vm.now.getDate(), "-");

        vm.step = 0;
        vm.cgv = false;
        vm.sucess = false;
        vm.tmp = {};
        vm.tmp.cropImage = '';
        vm.confirmPwd = "";
        vm.errors = [];

        vm.newUser = {};
        vm.newUser.zipcode = 0;
        vm.newUser.skills = [];
        vm.newUser.sex = -1;

        vm.time = 7;

        function timer() {
            if( vm.time > 0 ) {
                vm.time -= 1;
                $timeout(timer, 1000);
            } else {
                $location.path('/login');
            }
        }

        function _formatDate(f, s, t, separator) {
            var date = "";
            if (f < 10) {
                date += "0";
            }
            date += f + separator;
            if (s < 10) {
                date += "0";
            }
            date += s + separator;
            if (t < 10) {
                date += "0";
            }
            date += t;
            return date;
        }
        
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

                RestService.put("/user", vm.newUser)
                    .then(function(data) {
                    console.log(vm.name, " :: New user created");
                    vm.success = true;
                    $timeout(timer, 1000); 
                }).catch(function(ret) {
                    addAlert(ret.data.error);
                });
            }
        }

        function changeStep(index) {
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