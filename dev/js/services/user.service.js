(function () {
    'use strict';

    angular
        .module('umannityApp.services')
        .factory('UserService', userService);

    userService.$inject = ['$q', 'RestService'];

    function userService($q, RestService) {
        var _user = null;

        var service = {
            get_user: get_user,
            get_api_key: get_api_key,
            load_user: load_user,
            login: login
        };

        return service;

        ////

        function load_user() {
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

        function get_user() {
            return _user;
        }

        function get_api_key() {
            return RestService.get_api_key();
        }

        function login(email, password) {
            var deferred = $q.defer();

            RestService.login(email, password)
                .then(function (request) {
                    if (request.data !== undefined) {
                        if (request.data.api_key !== undefined) {
                            RestService.set_api_key(request.data.api_key);
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