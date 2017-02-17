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
            editOffer: editOffer,
            getOfferList: getOfferList,
            participateOffer: participateOffer,
            deleteOffer: deleteOffer
    };

        return service;

        ////

        function putOffer(offerData) {
            var deferred = $q.defer();

            //offerData.partner_id
            RestService.put("/offers", offerData)
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

            RestService.get("/offers/" + id)
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

        function getOfferList(isPartner, id)
        {
            var deferred = $q.defer();

            if (isPartner == true) {
                var params = {partner_id:id};
            }
            RestService.get("/offers", params)
                .then(function (offers) {
                    deferred.resolve(offers.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }


        function editOffer(offerData) {
            var deferred = $q.defer();
            RestService.post("/offers/" + offerData.id, offerData)
                .then(function (offer) {
                    deferred.resolve(offer.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function participateOffer(offerId) {
            var deferred = $q.defer();
            var params = {offer_id: offerId};

            RestService.get("/offers/" + offerId + "/participate", params)
                .then(function (response) {
                    deferred.resolve(response.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function deleteOffer(offerId) {
            var deferred = $q.defer();

            RestService.delete("/offers/" + offerId)
                .then(function (request) {
                    deferred.resolve(request.data);
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