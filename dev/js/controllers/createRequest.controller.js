(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('createRequestController', createRequestController);

    createRequestController.$inject = ['$scope', '$location', 'UserService', 'createRequestService'];

    function createRequestController($scope, $location, UserService, createRequestService) {
        /* jshint validthis: true */

        var vm = this;

        vm.createRequest = createRequest;


        $scope.$on('$viewContentLoaded', onViewContentLoaded);
        ////

        function onViewContentLoaded () {

        }

        function createRequest() {
            var formatedString = vm.requestDescription.replace(/\n/g,"<br/>");
            var _newRequestData = {
                //"coordinates": vm.requestLocation.geometry.location.lat +','+ vm.requestLocation.geometry.location.lng,
                "description": formatedString,
                "location": vm.requestLocation.formatted_address,
                "name": vm.requestName,
                "skills": []
            };
            createRequestService.createRequest(_newRequestData).then(function (createdRequest) {
                $location.path('/request/' + createdRequest.id);
            });
        }

    }
})();