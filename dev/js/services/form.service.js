(function () {
    'use strict';

    angular
        .module('umannityApp.services')
        .factory('FormService', formService);

    formService.$inject = ['$q', 'RestService'];

    function formService($q, RestService) {

        var service = {
            sendForm: sendForm
        };

        return service;

        ////

        // Envoie le formulaire
        function sendForm (data)
        {
            var deferred = $q.defer();
            RestService.put("/form", data)
                .then(function (form) {
                    deferred.resolve(form.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

    }
})();