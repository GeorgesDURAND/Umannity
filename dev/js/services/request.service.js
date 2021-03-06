(function () {
    'use strict';

    angular
        .module('umannityApp.services')
        .factory('RequestService', requestService);

    requestService.$inject = ['$q', 'RestService'];

    function requestService($q, RestService) {

        var service = {
            loadRequest: loadRequest,
            loadUserData: loadUserData,
            acceptRequest: acceptRequest,
            reportRequest : reportRequest,
            deleteRequest : deleteRequest,
            editRequest : editRequest,
            loadUserPicture : loadUserPicture,
            preSelectUser : preSelectUser,
            unSelectUser : unSelectUser,
            selectUser: selectUser
        };

        return service;

        ////

        // Récupère les données de la demande d'aide
        function loadRequest (data)
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

        // Récupère les données de l'utilisateur
        function loadUserData (data)
        {
            var deferred = $q.defer();
            RestService.get("/users", data)
                .then(function (user) {
                    deferred.resolve(user.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        // Récupère la photo de l'utilisateur
        function loadUserPicture (data)
        {
            var deferred = $q.defer();
            RestService.get("/users/picture", data)
                .then(function (picture) {
                    deferred.resolve(picture.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        // Le bénévole propose son aide
        function acceptRequest(requestId) {
            var deferred = $q.defer();

            RestService.put("/requests/" + requestId + "/candidates")
                .then(function (request) {
                    deferred.resolve(request.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        // Le demandeur d'aide présélectionne un candidat
        function preSelectUser(requestId, userId) {
            var deferred = $q.defer();

            RestService.put("/requests/" + requestId + "/preselected/" + userId)
                .then(function (request) {
                    deferred.resolve(request.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        // Le demandeur d'aide supprime un candidat
        function unSelectUser(requestId, userId) {
            var deferred = $q.defer();

            RestService.delete("/requests/" + requestId + "/candidates/" + userId)
                .then(function (request) {
                    deferred.resolve(request.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function selectUser(requestId, userId) {
            var deferred = $q.defer();

            RestService.put("/requests/" + requestId + "/accepted/" + userId)
                .then(function (request) {
                    deferred.resolve(request.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        // Signaler une demande d'aide
        function reportRequest (data)
        {
            var deferred = $q.defer();
            RestService.put("/report", data)
                .then(function (report) {
                    deferred.resolve(report.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        // Supprime une demande d'aide
        function deleteRequest (id)
        {
            var deferred = $q.defer();
            RestService.delete("/requests/" + id)
                .then(function (deletedRequest) {
                    deferred.resolve(deletedRequest.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        // Met à jour la demande d'aide
        function editRequest (requestId, data)
        {
            var deferred = $q.defer();
            RestService.post("/requests/" + requestId, data)
                .then(function (editRequest) {
                    deferred.resolve(editRequest.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

    }
})();