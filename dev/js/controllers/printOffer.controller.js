(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('printOfferController', printOfferController);

    printOfferController.$inject = ['$scope', 'OfferService', 'PartnerService'];

    function printOfferController($scope, OfferService, PartnerService) {
        /* jshint validthis: true */
        var vm = this;

        $scope.$on('$viewContentLoaded', onViewContentLoaded);

        function onViewContentLoaded() {

        }

    }
})();