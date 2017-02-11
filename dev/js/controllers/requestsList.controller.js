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
        vm.loadPicture = loadPicture;
        vm.getPicture = getPicture;

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
            var _requestParams1 = {
                coordinates: _coordonnees,
                radius: vm.radius
            };

            RequestsListService.loadRequestsList(_requestParams1).then(function (allRequests) {
                angular.forEach(allRequests.requests, function(request, key) {
                    vm.helpsList.push(request);
                });
            });

            RequestsListService.loadCandidateRequestsList().then(function (candidateRequests) {
                console.log(candidateRequests);
                angular.forEach(candidateRequests.requests, function(request, key) {
                    vm.current_helps.push(request);
                });
            });

            RequestsListService.loadAcceptedRequestsList().then(function (allRequests) {
                angular.forEach(allRequests.requests, function(request, key) {
                    vm.completed_helps.push(request);
                });
            });
        }

        function setSkill (index, skill) {
            vm.selectedIndex = index;
            vm.chosenSkill = skill;
        }

        // Charge les images des demandeurs d'aide
        function loadPicture (requestsList) {
            angular.forEach(requestsList, function(request)
                            {
                RequestsListService.loadPicture(request.user_id).then(function (picture) {
                    var userPicture = {
                        user_id : request.user_id,
                        picture : picture
                    };
                    vm._listauthorData.push(userPicture);
                });
            });
        }

        function getPicture (id) {
            angular.forEach(vm._listauthorData, function(authorData) {
                if(id === authorData.user_id) {
                    return (authorData.picture);
                }
            });
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