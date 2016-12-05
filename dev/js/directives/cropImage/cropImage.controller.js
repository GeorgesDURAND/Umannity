// USAGE :
//  <crop-image object="MYOBJECT"></crop-image>
//  
//  MYOBJECT.cropImage will be the result image of the upload/crop directive.
//

(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('cropImageController', cropImageController);

    cropImageController.$inject = ['$scope', '$location', 'UserService', 'RestService'];

    function cropImageController($scope, $location, UserService, RestService) {
        /* jshint validthis: true */
        var crop = this;
        crop.name = "cropImageController";
        crop.newImage = '';
        crop.uploadImage = uploadImage;
        
        
        function uploadImage(files) {
            var file = files[0];
            var reader = new FileReader();
            reader.onload = function(event) {
                crop.newImage = event.target.result;
            };
            reader.readAsDataURL(file.file);
        }

    }
})();