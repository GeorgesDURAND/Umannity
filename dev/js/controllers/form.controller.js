(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('formController', formController);

    formController.$inject = ['$scope', '$location', 'UserService', 'RequestService', 'FormService', '$routeParams'];

    function formController($scope, $location, UserService, RequestService, FormService, $routeParams) {
        /* jshint validthis: true */

        var vm = this;
        var formatedString;

        vm.checkAllowedUser = checkAllowedUser;
        vm.sendForm = sendForm;
        vm.click1 = click1;
        vm.click2 = click2;
        vm.click3 = click3;
        vm.starRating1 = 0;
        vm.closeAlert = closeAlert;

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
                vm.author = Request.author;
                vm.volunteer = Request.accepted_user.id;
                checkAllowedUser();
            });
        }

        function checkAllowedUser () {
            if (vm.author.id !== vm.user.id && vm.volunteer !== vm.user.id) {
                $location.path('/requestsList');
            }
            if (vm.request.requester_completed === true && vm.author.id === vm.user.id) {
                $location.path('/requestsList');
            }
            // Si l'évaluation a déjà été faite
            if (vm.request.volunteer_completed === true && vm.volunteer === vm.user.id) {
                $location.path('/requestsList');
            }
        }

        function click1 (param) {
            vm.attitude = param;
        }

        function click2 (param) {
            vm.punctuality = param;
        }

        function click3 (param) {
            vm.global = param;
        }

        function closeAlert() {
            vm.error = undefined;
        }

        function sendForm() {
            if (vm.commentary !== undefined) {
                formatedString = vm.commentary.replace(/\n/g,"<br/>");
            }
            var _newFormData = {
                "request_id": vm.requestId,
                "name": vm.request.name,
                "requester_id" : vm.request.user_id,
                "volunteer_id" : vm.request.accepted_user.id,
                "duration": vm.duration,
                "commentary": formatedString,
                "state": vm.state,
                "attitude": vm.attitude,
                "punctuality": vm.punctuality,
                "global": vm.global
            };
            FormService.sendForm(_newFormData)
                .then(function () {
                    $location.path('/requestsList');
                })
                .catch(function(returnError) {
                    console.log(returnError.data.error);
                    vm.error = returnError.data.error;
                });
        }

    }
})();