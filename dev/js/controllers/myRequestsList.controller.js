(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('myRequestsListController', myRequestsListController);

    myRequestsListController.$inject = ['$scope', '$location', 'UserService', 'MyRequestsListService'];

    function myRequestsListController($scope, $location, UserService, MyRequestsListService) {
        /* jshint validthis: true */

        var vm = this;
        var _coordonnees;
        var _requestParams;
        var _userSkills;
        var _helpsList;
        $scope.tab = 1;

        vm.name = "myRequestsListController";
        vm.user = UserService.getUser();
        vm.my_skills = [];
        vm.chosenSkill = undefined;

        vm.setSkill = setSkill;
        vm.search = search;
        vm.searchBySkill = searchBySkill;
        vm.loadRequestsList = loadRequestsList;
        vm.changeView = changeView;
        vm.getRequiredSkills = getRequiredSkills;

        $scope.$on('$viewContentLoaded', onViewContentLoaded);
        ////

        function onViewContentLoaded () {
            UserService.loadUser().then(function(user) {
                vm.user = user;
                loadRequestsList();
            });
        }

        function loadRequestsList () {
            vm.helpsList = [];
            vm.completed_helps = [];
            vm.current_helps = [];
            var _requestParams = {
                user_id: vm.user.id
            };

            MyRequestsListService.loadRequestsList(_requestParams).then(function (myRequests) {
                vm.myRequests = myRequests;
                angular.forEach(myRequests.requests, function(request, key)
                                {
                    if (request.requester_completed === true && request.volunteer_completed === true) {
                        vm.completed_helps.push(request);
                    } else {
                        vm.helpsList.push(request);
                    }
                    getRequiredSkills();
                });
            });
        }

        function getRequiredSkills () {
            for (var i = vm.myRequests.requests.length - 1; i >= 0; i--) {
                for (var k = vm.myRequests.requests[i].skills.length - 1; k >= 0; k--) {
                    if (vm.my_skills.indexOf(vm.myRequests.requests[i].skills[k]) === -1 && vm.myRequests.requests[i].skills[k]) {
                        vm.my_skills.push(vm.myRequests.requests[i].skills[k]);
                    }
                }
            }
        }

        function setSkill (skill, index) {
            vm.chosenSkill = skill;
            vm.selectedIndex = index;
        }

        function search (item) {
            if (vm.searchText === undefined) {
                return true;
            }
            else {
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