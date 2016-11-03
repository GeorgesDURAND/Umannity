(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('visioController', visioController);

    visioController.$inject = ['$scope', '$sce', '$interval', 'WebRTCService'];

    function visioController($scope, $sce, $interval, WebRTCService) {
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
        vm.acceptVisioConference = acceptVisioConference;
        vm.refuseVisioConference = refuseVisioConference;
        vm.makeCall = makeCall;
        $scope.$on('$viewContentLoaded', onViewContentLoaded);

        ////

        function onViewContentLoaded() {
            setUserMedia();
            getUserMedia();
            WebRTCService.connectRTC();
            _interval = $interval(getOffers, _pollingTime);
        }

        function makeCall(){
            var id = 1;
            console.log(vm.name + " :: calling " + 1);
            WebRTCService.createOffer(id);
        }

        function acceptVisioConference(id) {
            console.log(id);
            WebRTCService.createOffer(id);
            vm.notification = undefined;
        }

        function refuseVisioConference(id) {
            vm.notification = undefined;
        }

        function getOffers() {
            WebRTCService.getOffers()
                .then(function (offers) {
                    if (vm.offers != offers) {
                        console.log(vm.name + " :: loaded offers", offers);
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

        function getLocalVideo() {
            if (undefined !== vm.streamURL) {
                return $sce.trustAsResourceUrl(vm.streamURL);
            }
            else {
                console.log(vm.name + " :: vm.stream is undefined");
            }
        }

        function onUserMediaSuccess(stream) {
            vm.stream = stream;
            vm.streamURL = URL.createObjectURL(vm.stream);
        }

        function onUserMediaError(error) {
            console.log(vm.name + ':: navigator.getUserMedia error: ', error);
        }

    }
})();