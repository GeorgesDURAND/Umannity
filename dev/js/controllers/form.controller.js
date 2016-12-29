(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('formController', formController);

    formController.$inject = ['$scope', '$location', 'UserService', 'RequestService', 'FormService', '$routeParams'];

    function formController($scope, $location, UserService, RequestService, FormService, $routeParams) {
        /* jshint validthis: true */

        var vm = this;

        vm.checkAllowedUser = checkAllowedUser;
        vm.sendForm = sendForm;
        vm.click1 = click1;
        vm.click2 = click2;
        vm.click3 = click3;
        vm.starRating1 = 0;


        $scope.$on('$viewContentLoaded', onViewContentLoaded);
        ////

        function onViewContentLoaded () {
            vm.requestId = $routeParams.requestId;
            vm.user = UserService.getUser();
            var _loadRequest = {
                id: vm.requestId
            };
            RequestService.loadRequest(_loadRequest).then(function (Request) {
                vm.request = Request;
                vm.authorId = Request.user_id;
                vm.volunteer = Request.accepted_user;
                checkAllowedUser();
            });
        }

        function checkAllowedUser () {
            console.log("vm.user.id ",vm.user.id);
            console.log("vvm.authorId ",vm.authorId);
            console.log("vm.volunteer ",vm.volunteer);
            if (vm.authorId !== vm.user.id && vm.volunteer !== vm.user.id)
                $location.path('/requestsList');
        }

        function click1 (param) {
            vm.attitude = param;
        }

        function click2 (param) {
            vm.ponctuality = param;
        }

        function click3 (param) {
            vm.global = param;
        }


        function sendForm() {
            if (vm.commentary !== undefined)
                var formatedString = vm.commentary.replace(/\n/g,"<br/>");
            var _newFormData = {
                "request_id": vm.requestId,
                "name": vm.request.name,
                "requester_id" : vm.request.user_id,
                "volunteer_id" : vm.request.accepted_user,
                "duration": vm.duration,
                "commentary": formatedString,
                "state": vm.state,
                "attitude": vm.attitude,
                "ponctuality": vm.ponctuality,
                "global": vm.global
            };
            FormService.sendForm(_newFormData).then(function () {
                $location.path('/listRequest');
            });
        }

    }
})();