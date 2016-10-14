(function () {
    'use strict';

    angular
        .module('umannityApp.services')
        .factory('UserService', userService);

    userService.$inject = ['$q', 'RestService'];

    function userService($q, RestService) {
        var _user;

        var service = {
            getUser: getUser,
            getApiKey: getApiKey,
            loadUser: loadUser,
            login: login,
            logout: logout
        };

        return service;

        ////

        function logout(){
            RestService.removeApiKey();
        }

        function loadUser() {
            var deferred = $q.defer();

            RestService.get("/user")
                .then(function (request) {
                    var user = request.data;
                    _user = user;
                    deferred.resolve(user);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function getUser() {
            console.log("userService :: getUser called");
            return _user;
        }

        function getApiKey() {
            return RestService.getApiKey();
        }

        function login(email, password) {
            var deferred = $q.defer();

            RestService.login(email, password)
                .then(function (request) {
                    if (request.data !== undefined) {
                        if (request.data.api_key !== undefined) {
                            RestService.setApiKey(request.data.api_key);
                            deferred.resolve(request.data.api_key);
                        }
                    }
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }
    }
})();