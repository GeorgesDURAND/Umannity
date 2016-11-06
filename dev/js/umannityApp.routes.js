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
                redirectTo: '/profile'
            })
            .when('/profile', {
                templateUrl: 'partials/profile.html',
                controller: 'profileController',
                controllerAs: 'vm'
            })
            .when('/login', {
                templateUrl: "partials/loginUser.html",
                controller: 'loginController',
                controllerAs: 'vm'
            })
            .when('/subscribe', {
                templateUrl: "partials/subscribe.html",
                controller: 'subscribeController'
            })
            .when('/chat', {
                templateUrl: "partials/chat.html",
                controller: 'chatController',
                controllerAs: 'vm'
            })
            .when('/admin/stats', {
                templateUrl: "partials/stats.html",
                controller: 'statsController',
                controllerAs: 'vm'
            })
            .when('/visio', {
                templateUrl: 'partials/visio.html',
                controller: 'visioController',
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