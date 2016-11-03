/* global RTCPeerConnection */
(function () {
  'use strict';

  angular
    .module('umannityApp.services')
    .factory('WebRTCService', webRTCService);

  webRTCService.$inject = [ '$q', '$base64', 'RestService' ];

  function webRTCService ($q, $base64, RestService) {
    var _iceConfig = { 'iceServers': [ { 'urls': 'stun:umannity.com:3478' } ] };
    var _connection;
    var _sdpConstraints = {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    };
    var _RTCDescription;
    var _RTCPeerConnection = webkitRTCPeerConnection || RTCPeerConnection;
    var _peerConnections = {};
    var _stream;
    var _offers = [];
    var _answers = [];
    var _ice = [];

    var service = {
      getOffers: getOffers,
      acceptOffer: acceptOffer,
      refuseOffer: refuseOffer,
      connectRTC: connectRTC,
      createOffer: createOffer,
      init: init
    };

    return service;

    ////

    function onAddStream (evnt) {
      console.log("GOT STREAM", evnt);
    }

    function onIceCandidate (evnt) {
      console.log("GOT ICE CANDIDATE", evnt);
    }

    function init (stream) {
      _stream = stream;
      _connection.addStream(stream);
      _connection.onicecandidate = onIceCandidate;
      _connection.onaddstream = onAddStream;
    }

    function onDescriptionReceived (description, emitter) {
      _connection.setLocalDescription(description);
      _postOffer(description, emitter, "sdp-answer");
    }

    function acceptOffer (offer) {
      offer = { sdp: offer.RTCDescription, type: "offer", emitter: offer.emitter };
      _connection.setRemoteDescription(
        new RTCSessionDescription(offer), function () {
          _connection.createAnswer(
            function (description) {
              onDescriptionReceived(description, offer.emitter, offer.type);
            },
            function (error) {
              console.log(error);
            });
        },
        function (error) {
          console.log(error);
        });
    }

    function _postOffer (RTCDescription, recipient_id, type) {
      if (undefined === type) {
        type = "sdp-offer";
      }
      console.log("Posting offer", recipient_id);
      var data = { RTCDescription: $base64.encode(RTCDescription.sdp), recipient: recipient_id, type: type };
      RestService.post("/webrtc/offer", data)
        .then(function (request) {
          console.log(request.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    function createOffer (recipient_id) {
      _connection
        .createOffer(
          function (RTCDescription) {
            _connection.setLocalDescription(RTCDescription);
            _RTCDescription = RTCDescription;
            _postOffer(RTCDescription, recipient_id);
          },
          function (error) {
            console.log(error);
          },
          _sdpConstraints);
    }

    function connectRTC () {
      _connection = new _RTCPeerConnection(_iceConfig);
    }

    function refuseOffer () {
    }

    function parseData (offers) {
      _offers = [];
      _answers = [];
      _ice = [];
      angular.forEach(offers, function (offer) {
        offer.RTCDescription = $base64.decode(offer.RTCDescription);
        switch (offer.type) {
          case 'sdp-offer':
            _offers.push(offer);
            break;
          case 'sdp-answer':
            _answers.push(offer);
            break;
          case 'ice':
            _ice.push(offer);
            break;
        }
      });
      return _offers;
    }

    function getOffers () {
      var deferred = $q.defer();
      RestService.get("/webrtc/offers")
        .then(function (request) {
          deferred.resolve(parseData(request.data.offers));
        })
        .catch(function (error) {
          deferred.reject(error);
        });
      return deferred.promise;
    }

  }
})();