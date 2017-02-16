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
            getPartner: getPartner,
            loadPartner: loadPartner,
            login: login,
            logout: logout,
            //putPicture: putPicture,
            //loadPicture: loadPicture,
            //getPicture: getPicture,
            editProfile: editProfile
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

        function editProfile(partnerData) {
            var id;
            id = _partner.id;
            partnerData.id = id;

            var deferred = $q.defer();
            RestService.post("/partners", partnerData)
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

            RestService.get("/partners", params)
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

       /* function putPicture(image) {
            var deferred = $q.defer();
            var data = {
                picture: image
            };
                console.log("putpicture partner service");
            RestService.put("/partners/picture", data)
                .then(function (request) {
                    deferred.resolve(request.data);
                    console.log("putpicture partner service SUCCESS");
                })
                .catch(function (error) {
                    console.log("putpicture partner ERROR");

                    deferred.reject(error);
                });
            return deferred.promise;
        }*/

        /*function loadPicture(id) {
            var deferred = $q.defer();
            var params = {id:id};

            RestService.get("/partner/picture", params)
                .then(function (request) {
                    var picture = request.data.picture;

                    _picture = picture;
                    deferred.resolve(picture);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function getPicture() {
            console.log("PartnerService :: getPicture called");
            return _picture;
        }*/

        function getPartner() {
            console.log("partnerService :: getPartner called");
            if (undefined === _partner) {
                var storePartner = $cookies.get(_cache_key);
                if (undefined !== storePartner) {
                    _partner = JSON.parse(storePartner);
                }
            }
            return _partner;
        }

        function login(email, password) {
            var deferred = $q.defer();
            var data = {
                email: email,
                password: password
            };

            RestService.post("/connect", data)
                .then(function (request) {
                    if (request.data !== undefined) {
                        if (request.data.api_key !== undefined) {
                            RestService.setApiKey(request.data.api_key);
                            RestService.setType(request.data.type);
                            deferred.resolve(request.data);
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