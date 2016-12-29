// USAGE :
//  <choose-skills object="MYOBJECT"></choose-skills>
//  
//  MYOBJECT will be the array of skills selected by the user.
//

(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('chooseSkillsController', chooseSkillsController);

    chooseSkillsController.$inject = ['$scope', 'RestService'];

    function chooseSkillsController($scope, RestService) {
        /* jshint validthis: true */
        var vm = this;
        vm.name = "chooseSkillsController";
        vm.showSkills = showSkills;
        vm.toggleSkill = toggleSkill;
        vm.categories = [];

        RestService.get('/skillcategory')
            .then(function(data){
            angular.forEach(data.data.categories, function(category, key){
                var obj = {
                    name: category
                }; 
                vm.categories.push(obj);
            });
        }).catch(function(ret){
            console.log(vm.name, " :: Error : ", ret.data.error);
        });

        function showSkills(idx) {
            /* GET SKILLS OF THE CLICKED CATEGORY */
            if (!vm.categories[idx].skills){
                var data = {
                    name: vm.categories[idx].name
                };
                RestService.get('/skillcategory', data)
                    .then(function(data){
                    vm.categories[idx].skills = data.data.skills;
                }).catch(function(ret){
                    console.log(vm.name, " :: Error : ", ret.data.error);
                });
            }
            /* SHOW/HIDE THE DIV WITH THE SKILL */
            if (vm.last_elem){ vm.last_elem.classList.toggle("show"); }
            var elem = document.getElementById(vm.categories[idx].name);
            elem.classList.toggle("show");
            vm.last_elem = elem;
        }

        function toggleSkill(str) {
            var idx = $scope.skills.indexOf(str);
            if (idx === -1){
                $scope.skills.push(str);
            } else {
                $scope.skills.splice(idx, 1);
            }
        }

    }
})();