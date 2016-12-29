/*global angular */
var umannityApp = angular.module('umannityApp', [
    'umannityApp.controllers',
    'umannityApp.services',
    'umannityApp.directives',
    'ngRoute',
    'ui.bootstrap',
    'pascalprecht.translate',
    'ngSanitize',
    'ngCookies',
    'chart.js',
    'base64',
    'vsGoogleAutocomplete',
    'flow',
    'ngImgCrop',
    'ngAria',
    'luegg.directives',
    'ngMaterial'
]);

var umannityAppControllers = angular.module('umannityApp.controllers', []);
var umannityAppServices = angular.module('umannityApp.services', []);
var umannityAppDirectives = angular.module('umannityApp.directives', []);