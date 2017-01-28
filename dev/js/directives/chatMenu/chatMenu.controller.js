(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('chatMenuController', chatMenuController);

    chatMenuController.$inject = ['$scope', '$q', '$location', 'RequestService', 'ChatService'];

    function chatMenuController($scope, $q, $location, RequestService, ChatService) {
        /* jshint validthis: true */
        var vm = this;

        vm.name = "chatMenuController";
        vm.changeView = changeView;
        vm.openClose = openClose;
        vm.openConv = openConv;
        vm.visioCall = visioCall;
        vm.loadFirstConversation = loadFirstConversation;
        vm.fixDateFormat = fixDateFormat;
        vm.loadChatName = loadChatName;
        vm.sendMessage = sendMessage;
        var _message;
        vm.displayConv = false;
        vm.isCollapsed = true;
        vm.contacts_id = [];
        vm.contacts = [];

        function visioCall(id){
            $location.path("/visio/" +  id);
        }

        function changeView(viewName) {
            console.log("view = ", viewName);
            $location.path(viewName);
        }

        function openClose(id) {
            var elem = document.getElementById(id);
            elem.classList.toggle('show');
        }
        
        function openConv(convId) {
            var firstConv;
            vm.displayConv = true;

            angular.forEach(vm.contacts, function(value, key) {
                if (convId === value.convs[0].id) {
                    firstConv = vm.contacts[key];
                }
            });

            ChatService.loadChat(firstConv.convs[0].id).then(function (data) {
                vm.dialogues = data.messages;
                fixDateFormat();
                vm.loadChatName(data.messages[0].request_id);
                vm.recipient_id = firstConv.user_id;
                vm.conversation_id = firstConv.convs[0].id;
                vm.recipient_picture = firstConv.picture;
                vm.userName = firstConv.name;
            });
            vm.timerId = setInterval(loadChat, 3000);
        }

        function fixDateFormat() {
            angular.forEach(vm.dialogues, function (message) {
                message.date = message.date * 1000;
            });
        }

        // A appeler pour actualiser la conversation
        function loadChat() {
            ChatService.loadChat(vm.conversation_id).then(function (data) {
                vm.dialogues = data.messages;
                fixDateFormat();
            });
        }

        function _getConvName(convId) {
            var deffered = $q.defer();
            var id = convId.substring(0, convId.indexOf(':'));
            var _loadRequest = {
                id: id
            };
            RequestService.loadRequest(_loadRequest).then(function (Request) {
                deffered.resolve(Request.name);
            }).catch(function(ret) {
                console.log(vm.name, ":: Error : ", ret);
                deffered.reject('Error while loading....');
            });
            return deffered.promise;
        }

        function _getContacts(convList) {
            var find;
            angular.forEach(convList, function(conv, key){
                find = 0;
                angular.forEach(vm.contacts, function(contact, key){
                    if (conv.user.id === contact.user_id){
                        find = 1;
                        _getConvName(conv.conversation_id)
                            .then(function(data){
                            var objConv = {
                                id : conv.conversation_id,
                                name : data
                            };
                            vm.contacts[key].convs.push(objConv);
                        });
                    }
                });
                if (find === 0) {
                    var obj = {
                        user_id: conv.user.id,
                        name: conv.user.first_name + " " + conv.user.last_name,
                        picture: conv.user.picture,
                        convs: []
                    };
                    _getConvName(conv.conversation_id)
                        .then(function(data){
                        var objConv = {
                            id : conv.conversation_id,
                            name : data
                        };
                        obj.convs.push(objConv);
                    });
                    vm.contacts.push(obj);
                }
            });

        }

        // Charge la première conversation lorsque l'utilisateur arrive sur le chat
        function loadFirstConversation () {
            var firstConv;

            angular.forEach(vm.contacts, function(value, key) {
                if ($routeParams.convId === value.conversation_id) {
                    firstConv = vm.contacts[key];
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
            //vm.timerId = setInterval(loadChat, 3000);
        }

        function loadChatName(id_conv) {
            var _loadRequest = {
                id: id_conv
            };
            RequestService.loadRequest(_loadRequest).then(function (Request) {
                vm.request_name = Request.name;
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

        ChatService.loadChatsUsers()
            .then(function(data) {
            console.log(vm.name, ":: contacts loaded");
            _getContacts(data);
        }).catch(function(ret) {
            console.log(vm.name, ":: Error : ", ret);

        });
    }
})();