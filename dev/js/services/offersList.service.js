(function () {
    'use strict';

    angular
        .module('umannityApp.services')
        .factory('OffersListService', offersListService);

    offersListService.$inject = ['$q', 'RestService'];

    function offersListService($q, RestService) {

        var service = {
            loadOffersList: loadOffersList
        };

        return service;

        ////

        // Récupère l'ensemble des demandes d'aides
        function loadOffersList (data)
        {
            var deferred = $q.defer();
            RestService.get("/offer", data)
                .then(function (offer) {
                    deferred.resolve(offer.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }
    }
})();