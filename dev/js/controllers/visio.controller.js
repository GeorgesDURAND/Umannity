(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('visioController', visioController);

    visioController.$inject = ['$scope', '$window', '$sce', '$interval', 'WebRTCService', 'UserService'];

    function visioController($scope, $window, $sce, $interval, WebRTCService, UserService) {
        window.URL = window.URL || window.mozURL || window.webkitURL;
        /* jshint validthis: true */
        var vm = this;
        var _interval;
        var _pollingTime = 5000;
        var _constraints = {
            audio: true,
            video: true
        };

        vm.name = "visioController";
        vm.getLocalVideo = getLocalVideo;
        vm.getExternalVideo = getExternalVideo;
        vm.acceptVisioConference = acceptVisioConference;
        vm.refuseVisioConference = refuseVisioConference;
        vm.makeCall = makeCall;
        vm.deleteOffers = deleteOffers;
        vm.hangup = hangup;
        vm.state = 'disconnected';
        $scope.$on('$viewContentLoaded', onViewContentLoaded);

        ////

        function onViewContentLoaded() {
            vm.user = UserService.getUser();
            setUserMedia();
            getUserMedia();
            initOffersData();
            _interval = $interval(getOffers, _pollingTime);
        }

        function initOffersData() {
            WebRTCService.deleteOffers()
                .then(function () {
                    getOffers();
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        function deleteOffers() {
            WebRTCService.deleteOffers()
                .then(function (data) {
                    console.log(data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        function makeCall() {
            console.log(vm.name + " :: calling " + vm.recipient_id);
            WebRTCService.createOffer(vm.recipient_id);
        }

        function acceptVisioConference(offer) {
            console.log(vm.name + " :: accepting visioConference", offer);
            WebRTCService.acceptOffer(offer);
            $interval.cancel(_interval);
            vm.offers = [];
            vm.state = 'pending';
        }

        function refuseVisioConference(id) {
            console.log(vm.name + " :: refusing visioConference", id);
            WebRTCService.refuseOffer(id);
        }

        function getOffers() {
            WebRTCService.getOffers()
                .then(function (offers) {
                    if (vm.offers !== offers) {
                        vm.offers = offers;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        function setUserMedia() {
            navigator.getUserMedia = (
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);
        }

        function getUserMedia() {
            navigator.getUserMedia(_constraints, onUserMediaSuccess, onUserMediaError);
        }

        function getExternalVideo() {
            if (undefined === vm.externalStream && undefined !== WebRTCService.getExternalMediaStream()) {
                vm.externalStream = WebRTCService.getExternalMediaStream();
                vm.externalStreamURL = window.URL.createObjectURL(vm.externalStream);
                console.log(vm.name + " :: External Stream URL", vm.externalStreamURL);
                return $sce.trustAsResourceUrl(vm.externalStreamURL);
            }
        }

        function getLocalVideo() {
            if (undefined !== vm.streamURL) {
                return $sce.trustAsResourceUrl(vm.streamURL);
            }
            else {
                console.log(vm.name + " :: vm.stream is undefined");
            }
        }

        function hangup() {
            $window.location.reload();
        }

        function setState(state) {
            $scope.$apply(function () {
                vm.state = state;
            });
        }

        function onConnect(state) {
            console.log(vm.name + ':: stream ' + state);
            setState(state);
        }

        function onPending(state) {
            console.log(vm.name + ':: stream ' + state);
            setState(state);
        }

        function onDisconnect(state) {
            console.log(vm.name + ':: stream ' + state);
            hangup();
        }

        function onUserMediaSuccess(stream) {
            WebRTCService.init(stream, onConnect, onDisconnect, onPending);
            vm.stream = stream;
            vm.streamURL = window.URL.createObjectURL(vm.stream);
        }

        function onUserMediaError(error) {
            console.log(vm.name + ':: navigator.getUserMedia error: ', error);
        }

    }
})();