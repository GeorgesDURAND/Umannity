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
            .when('/loginPartner', {
            templateUrl: "partials/loginPartner.html",
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
            templateUrl: "partials/statsAdmin.html",
            controller: 'statsAdminController',
            controllerAs: 'vm'
        })
            .when('/admin/createPartner', {
            templateUrl: "partials/createPartnerAdmin.html",
            controller: 'createPartnerAdminController',
        })
            .when('/admin/reports', {
            templateUrl: "partials/reportsListAdmin.html",
            controller: 'reportsListAdminController',
            controllerAs: 'vm'
        })
            .when('/error', {
            templateUrl: 'partials/error.html'
        })
            .when('/visio', {
            controller: 'visioController',
            templateUrl: 'partials/visio.html',
            controllerAs: 'vm'
        })
            .otherwise({
            redirectTo: '/error'
        });
    }
})();