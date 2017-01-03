(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('offersListController', offersListController);

    offersListController.$inject = ['$scope', '$location', 'UserService', 'OffersListService'];

    function offersListController($scope, $location, UserService, OffersListService) {
        /* jshint validthis: true */

        var vm = this;

        vm.name = "offersListController";
        vm.user = UserService.getUser();

        vm.search = search;
        vm.loadOffersList = loadOffersList;
        vm.changeView = changeView;
        $scope.$on('$viewContentLoaded', onViewContentLoaded);
        ////

        function onViewContentLoaded () {
            UserService.loadUser().then(function(user) {
                vm.user = user;
                loadOffersList();
            });
        }

        function loadOffersList () {
            OffersListService.loadOffersList().then(function (allOffers) {
                vm.offersList = allOffers.offers;
            });
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