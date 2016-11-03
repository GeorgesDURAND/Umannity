(function () {
    'use strict';

    angular
        .module('umannityApp.services')
        .factory('UserService', userService);

    userService.$inject = ['$q', 'RestService'];

    function userService($q, RestService) {
        var _user;
        var _picture;

        var service = {
            getUser: getUser,
            getApiKey: getApiKey,
            loadUser: loadUser,
            login: login,
            logout: logout,
            formatBirthdate: formatBirthdate,
            loadPicture: loadPicture,
            getPicture: getPicture
        };

        return service;

        ////

        function logout() {
            RestService.removeApiKey();
        }

        /*function putPicture() {
            var deferred = $q.defer();
            var isUpload = false;

            RestService.put("/user/picture")
                .then(function (request){
                    isUpload = true;
                })
                .catch(function (request) {
                    deffered.resolve(error);
                })
        }*/

        function loadUser() {
            var deferred = $q.defer();

            RestService.get("/user")
                .then(function (request) {
                    var user = request.data;
                    user.formattedBirthdate = formatBirthdate(user.birthdate);

                    _user = user;
                    deferred.resolve(user);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function getUser() {
            console.log("userService :: getUser called");
            return _user;
        }

        function loadPicture() {
            var deferred = $q.defer();

            RestService.get("/user/picture")
                .then(function (request) {
                    var picture = request.data;

                    _picture = picture;
                    deferred.resolve(picture);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function getPicture() {
            console.log("userService :: getPicture called");
            return _picture;
        }

        function getApiKey() {
            return RestService.getApiKey();
        }

        function login(email, password) {
            var deferred = $q.defer();

            RestService.login(email, password)
                .then(function (request) {
                    if (request.data !== undefined) {
                        if (request.data.api_key !== undefined) {
                            RestService.setApiKey(request.data.api_key);
                            deferred.resolve(request.data.api_key);
                        }
                    }
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function formatBirthdate(birthdate) {
            var tmp = new Date(birthdate * 1000);
            var date = (tmp.getDate() > 9 ? tmp.getDate() : "0" + tmp.getDate());
            var month = (tmp.getMonth() > 9 ? (tmp.getMonth() + 1) : "0" + (tmp.getMonth() + 1));
            var year = tmp.getYear() + 1900;
            return date + "/" + month + "/" + year;
        }
    }
})();