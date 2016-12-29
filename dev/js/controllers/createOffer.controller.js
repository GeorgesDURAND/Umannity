(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('createOfferController', createOfferController);

    createOfferController.$inject = ['$scope', 'OfferService', 'PartnerService'];

    function createOfferController($scope, OfferService, PartnerService) {
        /* jshint validthis: true */
        var vm = this;
        vm.createOffer = createOffer;
        var _partner;

        $scope.$on('$viewContentLoaded', onViewContentLoaded);

        function onViewContentLoaded() {

        }

        function getPartnerId() {
            _partner = PartnerService.getPartner();
            console.log("_partner.id.............", _partner.id);
            return _partner.id;
        }

        function createOffer() {
            vm.offer.partner_id = getPartnerId();
            OfferService.putOffer(vm.offer)
                .then(function (offer) {
                    console.log("Success createOffer", offer);
                })
                .catch(function (error) {
                    console.log("error createOffer", error.data.error);
                });
        }
    }
})();