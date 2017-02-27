(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('offersListController', offersListController);

    offersListController.$inject = ['$scope', '$location', 'UserService', 'OfferService', 'PartnerService'];

    function offersListController($scope, $location, UserService, OfferService, PartnerService) {
        /* jshint validthis: true */

        var vm = this;

        vm.name = "offersListController";
        vm.user = UserService.getUser();
        vm.partner = PartnerService.getPartner();

        vm.search = search;
        vm.changeView = changeView;

        $scope.$on('$viewContentLoaded', onViewContentLoaded);
        ////

        function onViewContentLoaded () {
            loadOffersList();
        }

        function loadOffersList () {
            if (undefined !== vm.partner) {
                OfferService.getOfferList(true, vm.partner.id)
                    .then(function (allOffers) {
                        vm.offersList = allOffers;
                    });
            }
            else {
                OfferService.getOfferList(false)
                    .then(function (allOffers) {
                    vm.offersList = allOffers;
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