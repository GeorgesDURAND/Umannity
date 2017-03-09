(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('requestsListController', requestsListController);

    requestsListController.$inject = ['$scope', '$location', 'UserService', 'RequestsListService'];

    function requestsListController($scope, $location, UserService, RequestsListService) {
        /* jshint validthis: true */

        var vm = this;
        var _coordonnees;
        var _requestParams;
        var _userSkills;
        var _helpsList;
        $scope.tab = 1;

        vm.name = "requestsListController";
        vm.user = UserService.getUser();
        vm._listauthorData = [];
        vm.radius = 10;
        vm.chosenSkill = undefined;

        vm.setSkill = setSkill;
        vm.search = search;
        vm.searchBySkill = searchBySkill;
        vm.loadRequestsList = loadRequestsList;
        vm.changeView = changeView;

        $scope.$on('$viewContentLoaded', onViewContentLoaded);
        ////

        function onViewContentLoaded () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var latitude = position.coords.latitude.toString();
                    var longitude = position.coords.longitude.toString();
                    _coordonnees = latitude + ',' + longitude;

                    UserService.loadUser().then(function(user) {
                        vm.user = user;
                        loadRequestsList();
                    });
                });
            }
        }

        function loadRequestsList () {
            vm.helpsList = [];
            vm.completed_helps = [];
            vm.current_helps = [];
            var _requestParams = {
                coordinates: _coordonnees,
                radius: vm.radius
            };

            RequestsListService.loadRequestsList(_requestParams).then(function (allRequests) {
                vm.helpsList = allRequests;
            });

            RequestsListService.loadPreSelectedRequestsList().then(function (userPreSelectioned) {
                console.log(userPreSelectioned)
                vm.current_helps = userPreSelectioned;
                RequestsListService.loadCandidatesRequestsList().then(function (userCandidate) {
                    vm.current_helps += userCandidate;
                });

            });

            RequestsListService.loadCompletedRequest().then(function (completedRequests) {
                angular.forEach(completedRequests, function(completed_help) {
                    vm.completed_helps.push(completed_help.request);
                });
            });
        }

        function setSkill (index, skill) {
            vm.selectedIndex = index;
            vm.chosenSkill = skill;
        }

        function search (item) {
            if (vm.searchText === undefined) {
                return true;
            } else {
                if (item.name.toLowerCase().indexOf(vm.searchText.toLowerCase()) !== -1) {
                    return true;
                }
                for (var i = item.skills.length - 1; i >= 0; i--) {
                    if (item.skills[i].toLowerCase().indexOf(vm.searchText.toLowerCase()) !== -1) {
                        return true;
                    }
                }
            }
            return false;
        }

        function searchBySkill (item) {
            if (vm.chosenSkill === undefined) {
                return true;
            }
            else {
                for (var i = item.skills.length - 1; i >= 0; i--) {
                    if (item.skills[i].toLowerCase().indexOf(vm.chosenSkill.toLowerCase()) !== -1) {
                        return true;
                    }
                }
            }
            return false;
        }

        function changeView(viewName, parameter) {
            $location.path(viewName + parameter);
        }

    }
})();