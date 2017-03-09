(function() {
    'use strict';

    angular
        .module('umannityApp.directives')
        .directive('uRequestPicture', umannityRequestPicture);

    function umannityRequestPicture() {
        var directive = {
            controller: 'RequestPictureController',
            controllerAs: 'vmPic',
            scope: {
                userId: '@userId'
            },
            templateUrl: 'js/directives/requestPicture/requestPicture.html'
        };

        return directive;
    }
})();