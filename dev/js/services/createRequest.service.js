(function () {
    'use strict';

    angular
        .module('umannityApp.services')
        .factory('createRequestService', createRequestService);

    createRequestService.$inject = ['$q', 'RestService'];

    function createRequestService($q, RestService) {

        var service = {
            createRequest: createRequest
        };

        return service;

        ////

        // Récupère l'ensemble des emandes d'aides
        function createRequest (data)
        {
            var deferred = $q.defer();
            RestService.put("/requests", data)
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