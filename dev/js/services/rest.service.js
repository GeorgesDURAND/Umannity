(function () {
    'use strict';

    angular
        .module('umannityApp.services')
        .factory('RestService', restService);

    restService.$inject = ['$http', 'ConstantService', '$cookies'];

    function restService($http, ConstantService, $cookies) {
        var _api_url = ConstantService.api_url;
        var _api_key = $cookies.get('api_key');

        var service = {
            login: login,
            get: get,
            setApiKey: setApiKey,
            getApiKey: getApiKey,
            removeApiKey: removeApiKey
        };

        return service;

        ////

        function getApiKey() {
            return _api_key;
        }

        function removeApiKey() {
            $cookies.remove('api_key');
        }

        function setApiKey(api_key) {
            $cookies.put('api_key', api_key);
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