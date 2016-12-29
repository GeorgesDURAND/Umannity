(function() {
    'use strict';

    angular
        .module('umannityApp.directives')
        .directive('chooseSkills', chooseSkills);

    function chooseSkills() {
        var directive = {
            templateUrl:  'js/directives/chooseSkills/chooseSkills.html',
            controller: 'chooseSkillsController',
            controllerAs: 'skill',
            scope: {
                skills: "=object"
            }
        };
        return directive;
    }
})();