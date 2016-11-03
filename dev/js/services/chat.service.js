(function () {
    'use strict';

    angular
        .module('umannityApp.services')
        .factory('ChatService', chatService);

    chatService.$inject = ['$q', 'RestService'];

    function chatService($q, RestService) {
        var _chat;

        var service = {
            loadChat: loadChat,
            loadChatsUsers: loadChatsUsers,
            sendMessage: sendMessage
        };

        return service;

        ////

        // Récupère la conversation
        function loadChat(id_conv) {
            var deferred = $q.defer();

            RestService.get("/chat/" + id_conv)
                .then(function (request) {
                    deferred.resolve(request.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        // Récupère les contacts
        function loadChatsUsers() {
            var deferred = $q.defer();

            RestService.get("/chat/user")
                .then(function (request) {
                    deferred.resolve(request.data.conversations);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function sendMessage(buffer) {
            var deferred = $q.defer();

            RestService.put("/chat", buffer)
                .then(function (request) {
                    deferred.resolve(request.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }
    }
})();