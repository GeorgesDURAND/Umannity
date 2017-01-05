(function() {
    'use strict';

    angular
        .module('umannityApp.directives')
        .directive('uChatMenu', umannityChatMenu);

    function umannityChatMenu() {
        var directive = {
            templateUrl: 'js/directives/chatMenu/chatMenu.html',
            controller: 'chatMenuController',
            controllerAs: 'chat'
        };
        return directive;
    }
})();