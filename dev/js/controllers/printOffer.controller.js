(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('printOfferController', printOfferController);

    printOfferController.$inject = ['$scope', 'OfferService', 'PartnerService', '$routeParams'];

    function printOfferController($scope, OfferService, PartnerService, $routeParams) {
        /* jshint validthis: true */
        var vm = this;
        vm.partner = PartnerService.getPartner();
        vm.goEdit = false;
        vm.edited_offer = {};

        vm.closeAlert = closeAlert;
        vm.editOffer = editOffer;

        $scope.$on('$viewContentLoaded', onViewContentLoaded);

        function addAlert(error) {
            if (vm.errors.indexOf(error) === -1) {
                if (vm.errors.length >= 2) {
                    vm.errors.splice(0, 1);
                }
                vm.errors.push(error);
            }
        }

        function closeAlert(index) {
            vm.errors.splice(index, 1);
        }

        function onViewContentLoaded() {
            var id = $routeParams.offerId;
            loadOffer(id);
        }

        function loadOffer(id) {
            OfferService.getOffer(id)
                .then(function (offer) {
                    vm.offer = offer;
                })
                .catch(function (error) {
                    addAlert(error.data.error);
                });
        }

        function editOffer() {
            if (undefined !== vm.edited_offer) {
                vm.edited_offer.id = vm.offer.id;
                OfferService.editOffer(vm.edited_offer)
                    .then(function (offer) {
                        vm.offer = offer;
                        loadOffer(offer.id);
                        vm.goEdit = !vm.goEdit;
                        vm.edited_offer = undefined;
                    })
                    .catch(function (error) {
                        addAlert(error.data.error);
                    });
            }
        }
    }
})();
