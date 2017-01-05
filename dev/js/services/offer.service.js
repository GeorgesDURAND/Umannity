(function () {
    'use strict';

    angular
        .module('umannityApp.services')
        .factory('OfferService', offerService);

    offerService.$inject = ['$q', '$cookies', 'RestService'];

    function offerService($q, $cookies, RestService) {
        var _offer;

        var service = {
            putOffer: putOffer,
            getOffer: getOffer,
            editOffer: editOffer
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

        function getOffer(id) {
            var deferred = $q.defer();
            var params = {id:id};

            RestService.get("/offer", params)
                .then(function (request) {
                    var offer = request.data;
                    offer.formatOfferDate = formatOfferDate(offer.date);
                    _offer = offer;
                    deferred.resolve(offer);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function editOffer(offerData) {
            var deferred = $q.defer();
            RestService.post("/offer", offerData)
                .then(function (offer) {
                    deferred.resolve(offer.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function formatOfferDate(OfferDate) {
            var tmp = new Date(OfferDate * 1000);
            var date = (tmp.getDate() > 9 ? tmp.getDate() : "0" + tmp.getDate());
            var month = (tmp.getMonth() > 9 ? (tmp.getMonth() + 1) : "0" + (tmp.getMonth() + 1));
            var year = tmp.getYear() + 1900;
            return date + "/" + month + "/" + year;
        }
    }
})();