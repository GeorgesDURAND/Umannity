(function() {
    'use strict';

    angular
        .module('umannityApp.directives')
        .directive('cropImage', cropImage);

    cropImage.$inject = ['$translate'];

    function cropImage($translate) {
        var directive = {
            templateUrl:  'js/directives/pageTitle/pageTitle.html',
            restrict: 'E',
            scope: {
                title_page: '=title'
            },
            link: link
        };



        /*var handleFileSelect = function(evt) {
            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function($scope) {
                    $scope.myImage = evt.target.result;
                });
            };
            reader.readAsDataURL(file);
        };
        angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect); */

        return directive;
    }
})();