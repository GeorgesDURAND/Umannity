(function () {
    'use strict';

    angular
        .module('umannityApp.services')
        .factory('RestService', restService);

    restService.$inject = ['$http', 'ConstantService'];

    function restService($http, ConstantService) {
        var _api_url = ConstantService.api_url;
        var _api_key = null;

        var service = {
            login: login,
            get: get,
            set_api_key: set_api_key,
            get_api_key: get_api_key
        };

        return service;

        ////

        function get_api_key(api_key) {
            return _api_key;
        }

        function set_api_key(api_key) {
            _api_key = api_key;
        }

        function get(route, data, headers) {
            var req = {
                method: 'GET',
                url: _api_url + route,
                headers: {
                    'Authorization': _api_key
                },
                data: data
            };
            angular.extend(req.headers, headers);
            return $http(req);
        }

        function login(email, password) {
            var data = {
                email: email,
                password: password
            };
            return $http.post(_api_url + '/connect', data);
        }
    }
})();