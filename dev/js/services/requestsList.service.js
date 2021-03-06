(function () {
    'use strict';

    angular
        .module('umannityApp.services')
        .factory('RequestsListService', requestsListService);

    requestsListService.$inject = ['$q', 'RestService'];

    function requestsListService($q, RestService) {

        var service = {
            loadRequestsList: loadRequestsList,
            loadCompletedRequest: loadCompletedRequest,
            loadPreSelectedRequestsList: loadPreSelectedRequestsList,
            loadCandidatesRequestsList: loadCandidatesRequestsList,
            loadPicture : loadPicture
        };

        return service;

        ////

        // Récupère l'ensemble des demandes d'aides
        function loadRequestsList (data)
        {
            var deferred = $q.defer();
            RestService.get("/requests", data)
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
            RestService.get("/users/picture", params)
                .then(function (userPicture) {
                    var picture = userPicture.data.picture;
                    deferred.resolve(picture);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        // Récupère les données où l'utilisateur est pré-sélectionnés
        function loadPreSelectedRequestsList (data)
        {
            var deferred = $q.defer();
            RestService.get("/users/requests/preselected")
                .then(function (request) {
                    deferred.resolve(request.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        // Récupère les données où l'utilisateur est candidat
        function loadCandidatesRequestsList (data)
        {
            var deferred = $q.defer();
            RestService.get("/users/requests/candidate")
                .then(function (request) {
                    deferred.resolve(request.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function loadCompletedRequest (data)
        {
            var deferred = $q.defer();
            RestService.get("/users/forms")
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