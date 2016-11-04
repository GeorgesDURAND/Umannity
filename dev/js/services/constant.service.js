(function () {
    'use strict';

    angular
        .module('umannityApp.services')
        .factory('ConstantService', constantService);

    function constantService() {
        var service = {
            api_protocol : 'https',
            api_host : 'umannity.com/api',
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
