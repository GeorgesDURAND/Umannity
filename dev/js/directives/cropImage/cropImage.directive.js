(function() {
    'use strict';

    angular
        .module('umannityApp.directives')
        .directive('cropImage', cropImage);

    function cropImage() {
        var directive = {
            templateUrl:  'js/directives/cropImage/cropImage.html',
            controller: 'cropImageController',
            controllerAs: 'crop',
            scope: {
                obj: "=object"
            }
        };
        return directive;
    }
})();