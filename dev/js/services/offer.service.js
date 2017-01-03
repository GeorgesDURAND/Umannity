(function () {
    'use strict';

    angular
        .module('umannityApp.services')
        .factory('OfferService', offerService);

    offerService.$inject = ['$q', '$cookies', 'RestService'];

    function offerService($q, $cookies, RestService) {
        var _offer;

        var service = {
            putOffer: putOffer
        };

        return service;

        ////

        function putOffer(offerData) {
            var deferred = $q.defer();

            //offerData.partner_id
            RestService.put("/offer", offerData)
                .then(function (request) {
                    deferred.resolve(request.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function getOffer(partner_id) {
            var deferred = $q.defer();
            var params = {id:partner_id};

            RestService.get("/offer", params)
                .then(function (request) {
                    var offer = request.data;
                    _offer = offer;
                    deferred.resolve(offer);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }
    }
})();