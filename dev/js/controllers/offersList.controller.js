(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('offersListController', offersListController);

    offersListController.$inject = ['$scope', '$location', 'UserService', 'OffersListService', 'PartnerService'];

    function offersListController($scope, $location, UserService, OffersListService, PartnerService) {
        /* jshint validthis: true */

        var vm = this;

        vm.name = "offersListController";
        vm.user = UserService.getUser();
        vm.partner = PartnerService.getPartner();

        vm.search = search;
        vm.loadOffersList = loadOffersList;
        vm.changeView = changeView;
        $scope.$on('$viewContentLoaded', onViewContentLoaded);
        ////

        function onViewContentLoaded () {
            loadOffersList();
        }

        function loadOffersList () {
            if (undefined !== vm.partner) {
                OffersListService.loadOffersList(vm.partner.id)
                    .then(function (allOffers) {
                    vm.offersList = allOffers.offers;
                });
            }
            else {
                OffersListService.loadOffersList().then(function (allOffers) {
                    vm.offersList = allOffers.offers;
                });
            }
        }

        function search (item) {
            if (vm.searchText === undefined) {
                return true;
            }
            else {
                if (item.name.toLowerCase().indexOf(vm.searchText.toLowerCase()) !== -1) {
                    return true;
                }
            }
            return false;
        }

        function changeView(viewName, parameter) {
            $location.path(viewName + parameter);
        }

    }
})();