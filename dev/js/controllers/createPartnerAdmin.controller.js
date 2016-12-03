(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('createPartnerAdminController', createPartnerAdminController);

    createPartnerAdminController.$inject = ['$scope', 'UserService', 'RestService', 'ngImgCrop'];

    function createPartnerAdminController($scope, UserService, RestService, $translate) {
        /* jshint validthis: true */
        var vm = this;
        vm.newPartner = {};
        vm.newPartner.max_offers = 1;
        vm.partnerLogo = '';
        vm.partnerCropLogo = '';
        
        vm.createNewPartner = createNewPartner;

        vm.name = "createPartnerAdminController";
        
        function createNewPartner() {
            console.log(vm.newPartner);
        }

        var handleFileSelect = function(evt) {
            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function($scope){
                    $scope.myImage=evt.target.result;
                });
            };
            reader.readAsDataURL(file);
        };
        angular.element(document.querySelector('#fileInput')).on('chan
        
        
        
        
        
        
        
        
        
    }
})();
