(function () {
    'use strict';

    angular
        .module('umannityApp.services')
        .factory('ConstantService', constantService);

    function constantService() {
        var service = {
            api_protocol : 'http',
            api_host : '192.168.1.16',
            api_port : '1338'
        };

        service.api_url = service.api_protocol + '://' + service.api_host + ':' + service.api_port;

        return service;

        ////

    }
})();
