(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('subscribeController', loginController);

    loginController.$inject = ['$location', 'UserService'];

    function loginController($location, UserService) {
        /* jshint validthis: true */
        var vm = this;

    }
})();