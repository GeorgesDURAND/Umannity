// USAGE :
//  <u-page-title title="MYTITLE"></u-page-title>
//  
//  MYTITLE must be a keyword store in en_ENjson and fr_FR.json, 
//  as it will be translated then display in the right way

(function() {
    'use strict';

    angular
        .module('umannityApp.directives')
        .directive('uPageTitle', umannityPageTitle);

    umannityPageTitle.$inject = ['$translate'];

    function umannityPageTitle($translate) {
        var directive = {
            templateUrl:  'js/directives/pageTitle/pageTitle.html',
            restrict: 'E',
            scope: {
                title_page: '=title'
            },
            link: link
        };

        function link (scope, element, attrs) {
            scope.title_page = $translate.instant(attrs.title);
            if (scope.title_page.length > 3){
                scope.o_letter = scope.title_page[0];
                scope.inner_letters = scope.title_page.substring(1, scope.title_page.length - 3);
                scope.b_letter = scope.title_page[scope.title_page.length - 3];
                scope.end_letters = scope.title_page.substring(scope.title_page.length - 2);
            }else {
                if(scope.title_page[0]){scope.o_letter = scope.title_page[0];}
                if(scope.title_page[1]){scope.b_letter = scope.title_page[1];}
                if(scope.title_page[2]){scope.end_letters = scope.title_page[2];}
            }
        } 
        return directive;
    }
})();