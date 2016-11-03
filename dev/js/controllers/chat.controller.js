(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('chatController', chatController);

    chatController.$inject = ['$scope', 'UserService', 'ChatService'];

    function chatController($scope, UserService, ChatService) {
        /* jshint validthis: true */

        var vm = this;
        var _message;

        vm.name = "chatController";
        vm.user = UserService.getUser();
        vm.changeConversation = changeConversation;
        vm.sendMessage = sendMessage;

        $scope.$on('$viewContentLoaded', onViewContentLoaded);
        ////

        function onViewContentLoaded() {
            loadChatsUsers();
        }

        function loadChat() {
            ChatService.loadChat(vm.conversation_id).then(function (data) {
                console.log(data);
                vm.dialogues = data.messages;
                //vm.recipient_id = data.data.messages.recipient_id;
            });
        }

        function loadFirstConversation () {
            var firstConv = vm.chatsUsers[0];
            ChatService.loadChat(firstConv.conversation_id).then(function (data) {
                vm.dialogues = data.messages;
                vm.recipient_id = firstConv.user.id;
            });
        }

        function loadChatsUsers() {
            ChatService.loadChatsUsers().then(function (chatsUsers) {
                vm.chatsUsers = chatsUsers;
                if (undefined !== vm.chatsUsers) {
                    loadFirstConversation();
                }
            });
        }

        function changeConversation(id, conv_id) {
            vm.recipient_id = id;
            vm.conversation_id = conv_id;
            loadChat();
        }

        function sendMessage() {
            if (undefined !== vm.buffer) {
                _message = {
                    message : vm.buffer,
                    recipient_id: vm.recipient_id
                };

                ChatService.sendMessage(_message).then(function (data) {
                    vm.buffer = "";
                });
            }
        }

    }
})();