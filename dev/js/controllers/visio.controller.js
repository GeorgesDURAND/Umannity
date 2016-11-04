(function () {
  'use strict';

  angular
    .module('umannityApp.controllers')
    .controller('visioController', visioController);

  visioController.$inject = ['$scope', '$sce', '$interval', 'WebRTCService'];

  function visioController ($scope, $sce, $interval, WebRTCService) {
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
    $scope.$on('$viewContentLoaded', onViewContentLoaded);

    ////

    function onViewContentLoaded () {
      setUserMedia();
      getUserMedia();
      _interval = $interval(getOffers, _pollingTime);
    }

    function makeCall () {

      console.log(vm.name + " :: calling " + vm.recipient_id);
      WebRTCService.createOffer(vm.recipient_id);
    }

    function acceptVisioConference (offer) {
      console.log(vm.name + " :: accepting visioConference", offer);
      WebRTCService.acceptOffer(offer);
    }

    function refuseVisioConference (id) {
      console.log(vm.name + " :: refusing visioConference", id);
      WebRTCService.refuseOffer(id);
    }

    function getOffers () {
      WebRTCService.getOffers()
        .then(function (offers) {
          if (vm.offers !== offers) {
            console.log(vm.name + " :: loaded offers", offers);
            vm.offers = offers;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    function setUserMedia () {
      navigator.getUserMedia = (
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);
    }

    function getUserMedia () {
      navigator.getUserMedia(_constraints, onUserMediaSuccess, onUserMediaError);
    }

    function getExternalVideo() {
      if (undefined === vm.externalStreamURL && undefined !== WebRTCService.getExternalMediaStream()) {
        vm.externalStreamURL = WebRTCService.getExternalMediaStream();
        console.log(vm.name + " :: vm.externalStreamURL is now defined", vm.externalStreamURL);
        var streamURL = URL.createObjectURL(vm.externalStreamURL);
        console.log(vm.name + " :: External Stream URL", streamURL);
        return $sce.trustAsResourceUrl(streamURL);
      }
    }

    function getLocalVideo () {
      if (undefined !== vm.streamURL) {
        return $sce.trustAsResourceUrl(vm.streamURL);
      }
      else {
        console.log(vm.name + " :: vm.stream is undefined");
      }
    }

    function onUserMediaSuccess (stream) {
      WebRTCService.connectRTC();
      WebRTCService.init(stream);
      vm.stream = stream;
      vm.streamURL = URL.createObjectURL(vm.stream);
    }

    function onUserMediaError (error) {
      console.log(vm.name + ':: navigator.getUserMedia error: ', error);
    }

  }
})();