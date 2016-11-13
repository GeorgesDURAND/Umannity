(function() {
    'use strict';

    angular
        .module('umannityApp.directives')
        .directive('uUploadPicture', umannityUploadPicture);

    function umannityUploadPicture() {
        var directive = {
            scope: {
                picture: "=?fileread"
            }, link: link,
            controllerAs: "vm"
        };

        function link(scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.picture = loadEvent.target.result;
                        scope.$parent.vm.editProfilePicture(scope.picture);
                    });
                };
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
        return directive;
    }
})();
