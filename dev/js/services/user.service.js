(function () {
    'use strict';

    angular
        .module('umannityApp.services')
        .factory('UserService', userService);

    userService.$inject = ['$q', '$cookies', 'RestService'];

    function userService($q, $cookies, RestService) {
        var _user;
        var _picture;
        var _cache_key = 'user';

        var service = {
            getUser: getUser,
            getApiKey: getApiKey,
            loadUser: loadUser,
            login: login,
            logout: logout,
            formatBirthdate: formatBirthdate,
            loadPicture: loadPicture,
            getPicture: getPicture,
            editProfile: editProfile,
            putPicture: putPicture
        };

        return service;

        ////

        function logout() {
            $cookies.remove(_cache_key);
            RestService.removeApiKey();
            _user = undefined;
            _picture = undefined;
        }

        function storeUser(user) {
            console.log("storeUser :: user", user);
            user = {email: user.email, id:user.id, group: user.group, first_name: user.first_name, last_name: user.last_name};
            $cookies.put(_cache_key, JSON.stringify(user));
        }

        function putPicture(picture) {
            var deferred = $q.defer();
            RestService.put("/user/picture", picture)
                .then(function (request) {
                    deferred.resolve(request.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function putPicture(picture) {
            var deferred = $q.defer();
            RestService.put("/user/picture", picture)
                .then(function (request) {
                    deferred.resolve(request.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function editProfile(userData) {
            var deferred = $q.defer();
            RestService.post("/user", userData)
                .then(function (request) {
                    deferred.resolve(request.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function loadUser(id) {
            var deferred = $q.defer();
            var params = {id:id};

            RestService.get("/user", params)
                .then(function (request) {
                    var user = request.data;
                    user.formattedBirthdate = formatBirthdate(user.birthdate);
                    _user = user;
                    storeUser(user);
                    deferred.resolve(user);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function getUser() {
            console.log("userService :: getUser called");
            if (undefined === _user) {
                var storedUser = $cookies.get(_cache_key);
                if (undefined !== storedUser) {
                    _user = JSON.parse(storedUser);
                }
            }
            return _user;
        }

        function loadPicture(id) {
            var deferred = $q.defer();
            var params = {id:id};

            RestService.get("/user/picture", params)
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
            console.log("userService :: getPicture called");
            return _picture;
        }

        function getApiKey() {
            return RestService.getApiKey();
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

        function formatBirthdate(birthdate) {
            var tmp = new Date(birthdate * 1000);
            var date = (tmp.getDate() > 9 ? tmp.getDate() : "0" + tmp.getDate());
            var month = (tmp.getMonth() > 9 ? (tmp.getMonth() + 1) : "0" + (tmp.getMonth() + 1));
            var year = tmp.getYear() + 1900;
            return date + "/" + month + "/" + year;
        }
    }
})();