(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('chatController', chatController);

    chatController.$inject = ['$scope', 'UserService', 'ChatService', 'RequestService', '$routeParams', '$location'];

    function chatController($scope, UserService, ChatService, RequestService, $routeParams, $location) {
        /* jshint validthis: true */
        var vm = this;
        var _message;

        vm.name = "chatController";
        vm.user = UserService.getUser();
        vm.user.picture = UserService.getPicture();
        vm.changeConversation = changeConversation;
        vm.sendMessage = sendMessage;
        vm.loadChatName = loadChatName;
        vm.fixDateFormat = fixDateFormat;
        vm.visioCall = visioCall;

        $scope.$on('$viewContentLoaded', onViewContentLoaded);
        $scope.$on("$destroy", onDestroy);
        ////

        function onViewContentLoaded() {
            if (undefined === vm.user.picture) {
                UserService.loadPicture(vm.user.id).then(function (picture) {
                    vm.user.picture = picture;
                });
            }
            loadChatsUsers();
        }

        // Cette fonction se lance après avoir changer de vue. Elle arrête le refresh du chat.
        function onDestroy() {
            clearInterval(vm.timerId);
        }

        // A appeler pour actualiser la conversation
        function loadChat() {
            ChatService.loadChat(vm.conversation_id).then(function (data) {
                vm.dialogues = data.messages;
                fixDateFormat();
            });
        }

        function fixDateFormat() {
            angular.forEach(vm.dialogues, function (message) {
                message.date = message.date * 1000;
            });
        }

        function visioCall(id) {
            var message = {
                message: $translate.instant('VISIO_CHAT_USER_CALLING'),
                recipient_id: vm.recipient_id,
                conversation_id: vm.conversation_id
            };
            ChatService.sendMessage(message)
                .then(function (data) {
                    $location.path('/visio/' + id);
                });
        }

        // Charge la première conversation lorsque l'utilisateur arrive sur le chat
        function loadFirstConversation () {
            var firstConv;
            
            angular.forEach(vm.chatsUsers, function(value, key) {
                if ($routeParams.convId === value.conversation_id) {
                    firstConv = vm.chatsUsers[key];
                }
            });

            ChatService.loadChat(firstConv.conversation_id).then(function (data) {
                vm.dialogues = data.messages;
                fixDateFormat();
                vm.loadChatName(data.messages[0].request_id);
                vm.recipient_id = firstConv.user.id;
                vm.conversation_id = firstConv.conversation_id;
                vm.recipient_picture = firstConv.user.picture;
                vm.recipient_last_name = firstConv.user.last_name;
                vm.recipient_first_name = firstConv.user.first_name;
            });
            vm.timerId = setInterval(loadChat, 3000);
        }

        function loadChatName(id_conv) {
            var _loadRequest = {
                id: id_conv
            };
            RequestService.loadRequest(_loadRequest).then(function (Request) {
                vm.request_name = Request.name;
            });
        }

        // Charge les contacts
        function loadChatsUsers() {
            ChatService.loadChatsUsers().then(function (chatsUsers) {
                vm.chatsUsers = chatsUsers;
                if (undefined !== vm.chatsUsers) {
                    loadFirstConversation();
                }
            });
        }

        function changeConversation(chatUser) {
            vm.recipient_id = chatUser.user.id;
            vm.conversation_id = chatUser.conversation_id;
            ChatService.loadChat(vm.conversation_id).then(function (data) {
                vm.dialogues = data.messages;
                fixDateFormat();
                vm.loadChatName(data.messages[0].request_id);
                vm.recipient_picture = chatUser.user.picture;
                vm.recipient_last_name = chatUser.user.last_name;
                vm.recipient_first_name = chatUser.user.first_name;
            });
        }

        function sendMessage() {
            if (undefined !== vm.buffer) {
                _message = {
                    message: vm.buffer,
                    recipient_id: vm.recipient_id,
                    conversation_id: vm.conversation_id
                };

                ChatService.sendMessage(_message).then(function (data) {
                    vm.buffer = "";
                    loadChat();
                });
            }
        }
    }
})();