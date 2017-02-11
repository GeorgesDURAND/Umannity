(function () {
    'use strict';

    angular
        .module('umannityApp.services')
        .factory('ConstantService', constantService);

    function constantService() {
        var service = {
            api_protocol : 'http',
            api_host : '2.lp1.eu:1338',
            api_port : '',
            cache_id : 'u-cache'
        };

	if (service.api_port.length > 0) {
            service.api_url = service.api_protocol + '://' + service.api_host + ':' + service.api_port;
	}
	else {
	    service.api_url = service.api_protocol + '://' + service.api_host;
	}
        return service;

        ////

    }
})();
