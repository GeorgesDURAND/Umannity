(function () {
    'use strict';

    angular
        .module('umannityApp.services')
        .factory('MyRequestsListService', myRequestsListService);

    myRequestsListService.$inject = ['$q', 'RestService'];

    function myRequestsListService($q, RestService) {

        var service = {
            loadRequestsList: loadRequestsList,
            loadAcceptedRequestsList: loadAcceptedRequestsList,
            loadPicture : loadPicture
        };

        return service;

        ////

        // Récupère l'ensemble des demandes d'aides
        function loadRequestsList (data)
        {
            var deferred = $q.defer();
            RestService.get("/request", data)
                .then(function (request) {
                    deferred.resolve(request.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        // Renvoi l'image du demandeur d'aide
        function loadPicture(id)
        {
            var params = {
                id : id
            };
            var deferred = $q.defer();
            RestService.get("/user/picture", params)
                .then(function (userPicture) {
                    var picture = userPicture.data.picture;
                    deferred.resolve(picture);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function loadAcceptedRequestsList (data)
        {
            var deferred = $q.defer();
            RestService.get("/user/requests", data)
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