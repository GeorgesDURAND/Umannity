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
      var id = 1;
      console.log(vm.name + " :: calling " + 1);
      WebRTCService.createOffer(id);
    }

    function acceptVisioConference (offer) {
      console.log(vm.name + " :: accepting visioConference", offer);
      WebRTCService.acceptOffer(offer);
    }

    function refuseVisioConference (id) {
      console.log(vm.name + " :: refusing visioConference", id);
      vm.notification = undefined;
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