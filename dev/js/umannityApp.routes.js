/*global angular */
(function () {
    'use strict';

    angular
        .module('umannityApp')
        .config(routesBlock);

    routesBlock.$inject = ['$locationProvider', '$routeProvider'];

    function routesBlock($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider
            .when('/', {
                templateUrl: 'partials/home.html',
                controller: 'umannityAppController',
                controllerAs: 'vm'
            })
            .when('/login', {
                templateUrl : "partials/login.html",
                controller: 'loginController',
                controllerAs: 'vm'
            })
            .when('/error', {
                templateUrl: 'partials/error.html'
            })
            .otherwise({
                redirectTo: '/error'
            });
    }
})();