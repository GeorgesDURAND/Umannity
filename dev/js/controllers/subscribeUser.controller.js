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
        /*vm.openCGV = openCGV;*/

        vm.step = 1;
        vm.cgv = false;
        vm.confirmPwd = "";
        vm.newUser = [];
        vm.errors = [];
        
        vm.sex = 0;
        vm.tmp = [];

        /* $scope.$on('$viewContentLoaded', onViewContentLoaded);

        function onViewContentLoaded() {
           vm.step = 0;
        }*/

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
            if (checkInfo() === false){
                vm.errors = [];
                console.log("SUBSCRIBE");
            }
        }

        function changeStep(index) {
            /*if (checkInfo() === false){
                vm.errors = [];
                vm.step = index;
            }*/
            vm.step = index;
        }

        /*function openCGV () {
            console.log($location.path('/cgv'));
            
            window.open("#!/cgv", "_blank");
        }*/



        function checkInfo() {
            if (vm.newUser.first_name && vm.newUser.last_name && vm.newUser.email && vm.newUser.password && vm.confirmPwd){
                if (vm.newUser.password != vm.confirmPwd){
                    addAlert('BADCONFIRMPWD')
                    return true;
                }
            } else {
                addAlert('ALLCHAMPFILL')
                return true;
            }
            return false;
        }
    }
})();