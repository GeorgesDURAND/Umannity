(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('createRequestController', createRequestController);

    createRequestController.$inject = ['$scope', '$location', 'UserService', 'createRequestService'];

    function createRequestController($scope, $location, UserService, createRequestService) {
        /* jshint validthis: true */

        var vm = this;
        vm.skills = [];

        vm.createRequest = createRequest;

        $scope.$on('$viewContentLoaded', onViewContentLoaded);
        ////

        function onViewContentLoaded () {

        }

        function createRequest() {
            var formatedString = vm.requestDescription.replace(/\n/g,"<br/>");
            var _newRequestData = {
                "description": formatedString,
                "location": vm.requestLocation.formatted_address,
                "name": vm.requestName,
                "skills": vm.skills
            };
            createRequestService.createRequest(_newRequestData).then(function (createdRequest) {
                $location.path('/request/' + createdRequest.id);
            });
        }

    }
})();