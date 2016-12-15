(function () {
    'use strict';

    angular
        .module('umannityApp.services')
        .factory('PartnerService', partnerService);

    partnerService.$inject = ['$q', '$cookies', 'RestService'];

    function partnerService($q, $cookies, RestService) {
        var _partner;
        var _picture;
        var _cache_key = 'partner';

        var service = {
            logout: logout,
            loadPartner: loadPartner,
            editProfile: editProfile,
            putPicture: putPicture,
            login: login
        };

        return service;

        ////

        function logout() {
            $cookies.remove(_cache_key);
            RestService.removeApiKey();
            _partner = undefined;
            _picture = undefined;
        }

        function storePartner(partner) {
            console.log("storePartner :: partner", partner);
            partner = {email: partner.email, id:partner.id, baseline: partner.baseline, name: partner.name};
            _partner = partner;
            $cookies.put(_cache_key, JSON.stringify(partner));
        }

        function putPicture(picture) {
            var deferred = $q.defer();
            RestService.put("/partner/picture", picture)
                .then(function (request) {
                    deferred.resolve(request.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function editProfile(partnerData) {
            var id;
            id = _partner.id;
            partnerData.id = id;

            var deferred = $q.defer();
            RestService.post("/partner", partnerData)
                .then(function (request) {
                    deferred.resolve(request.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function loadPartner(id) {
            var deferred = $q.defer();
            var params = {id:id};

            RestService.get("/partner", params)
                .then(function (request) {
                    var partner = request.data;
                    _partner = partner;
                    storePartner(partner);
                    deferred.resolve(partner);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function login(email, password) {
            var deferred = $q.defer();

            var data = {
                email: email,
                password: password
            };
            RestService.post('/connect', data)
                .then(function (request) {
                    if (request.data !== undefined) {
                        if (request.data.api_key !== undefined) {
                            RestService.setApiKey(request.data.api_key);
                            deferred.resolve(request.data.type);
                        }
                    }
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }
    }
})();