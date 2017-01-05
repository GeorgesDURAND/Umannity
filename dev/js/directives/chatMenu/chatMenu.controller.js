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
            var url = '/chat/' + convId;
            console.log("URL = ", url);
            vm.changeView(url);
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

        ChatService.loadChatsUsers()
            .then(function(data) {
            console.log(vm.name, ":: contacts loaded");
            _getContacts(data);
        }).catch(function(ret) {
            console.log(vm.name, ":: Error : ", ret);

        });
    }
})();