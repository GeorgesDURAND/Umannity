(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('RequestPictureController', RequestPictureController);

    RequestPictureController.$inject = ['$scope', '$location', 'UserService', 'RestService'];

    function RequestPictureController($scope, $location, UserService, RestService) {
        /* jshint validthis: true */
        var vmPic = this;

        vmPic.name = "RequestPictureController";;

            var params = {id : $scope.userId};

            RestService.get("/users/picture", params)
                .then(function (request) {
                    vmPic.picture = request.data.picture;
                })
                .catch(function (error) {
                });
    }
})();