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
            .when('/partner', {
                templateUrl: 'partials/profilePartner.html',
                controller: 'profilePartnerController',
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
            .when('/resetPassword', {
            templateUrl: "partials/resetPassword.html",
            controller: 'resetPasswordController',
            controllerAs: 'vm'
        })
            .when('/subscribe', {
            templateUrl: "partials/subscribeUser.html",
            controller: 'subscribeUserController',
            controllerAs: 'vm'
        })
            .when('/cgv', {
            templateUrl: "partials/cgv.html",
            controller: 'subscribeUserController',
            controllerAs: 'vm'
        })
            .when('/chat', {
            templateUrl: "partials/chat.html",
            controller: 'chatController',
            controllerAs: 'vm'
        })
            .when('/createRequest', {
            templateUrl: "partials/createRequest.html",
            controller: 'createRequestController',
            controllerAs: 'vm'
        })
            .when('/requestsList', {
            templateUrl: "partials/requestsList.html",
            controller: 'requestsListController',
            controllerAs: 'vm'
        })
            .when('/request/:requestId', {
            templateUrl: "partials/request.html",
            controller: 'requestController',
            controllerAs: 'vm'
        })
            .when('/myRequestsList', {
            templateUrl: "partials/myRequestsList.html",
            controller: 'myRequestsListController',
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
            controllerAs: 'vm'
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
            .when('/offersList', {
            controller: 'offersListController',
            templateUrl: 'partials/offersList.html',
            controllerAs: 'vm'
        })
            .when('/createOffer', {
                controller: 'createOfferController',
                templateUrl: 'partials/createOffer.html',
                controllerAs: 'vm'
            })
            .otherwise({
            redirectTo: '/error'
        });
    }
})();