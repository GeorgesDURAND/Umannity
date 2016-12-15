(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('resetPasswordController', resetPasswordController);

    resetPasswordController.$inject = ['$location', 'UserService', 'RestService'];

    function resetPasswordController($location, UserService ,RestService) {
        /* jshint validthis: true */
        var vm = this;

        vm.name = "resetPasswordController";
        vm.changeView = changeView;
        vm.closeAlert = closeAlert;
        vm.resetPassword = resetPassword;
        vm.errors = [];
        vm.reset = false;
        vm.email = '';

        ////

        function changeView(viewName) {
            $location.path(viewName);
        }
        
        function closeAlert(index) {
            vm.errors.splice(index, 1);
        }

        function resetPassword () {
            RestService.post('/user/reset_password', {"email": vm.email} )
            .then(function (data) {
                console.log("ResetPassword :: notification sent");
                vm.reset = true;
            })
            .catch(function (error) {
                vm.errors.push(error.data.error);
            });
        }
        
    }
})();