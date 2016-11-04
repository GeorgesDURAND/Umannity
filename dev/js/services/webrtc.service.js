/* global RTCPeerConnection */
(function () {
  'use strict';

  angular
    .module('umannityApp.services')
    .factory('WebRTCService', webRTCService);

  webRTCService.$inject = ['$q', '$base64', 'RestService'];

  function webRTCService ($q, $base64, RestService) {
    //Multi-browser globals config hacks
    window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
    window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
    window.URL = window.URL || window.mozURL || window.webkitURL;

    //Local variables
    var _iceConfig = {'iceServers': [{'urls': 'stun:umannity.com:3478'}]};
    var _connection;
    var _sdpConstraints = {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    };
    var _RTCDescription;
    var _stream;
    var _offers = [];
    var _answers = [];
    var _ice = [];
    var _recipient;
    var _externalStream;

    var service = {
      getOffers: getOffers,
      acceptOffer: acceptOffer,
      refuseOffer: refuseOffer,
      connectRTC: connectRTC,
      createOffer: createOffer,
      getExternalMediaStream: getExternalMediaStream,
      init: init
    };

    return service;

    ////

    function getExternalMediaStream() {
      return _externalStream;
    }

    function onAddStream (event) {
      console.log("Got new stream :: ", event);
      _externalStream = event.stream;
    }

    function onIceCandidate (event) {
      if (null !== event.candidate) {
        console.log("Got ice candidate :: ", event);
        if (undefined !== _recipient) {
          _postIceCandidate(event.candidate, _recipient);
        }
      }
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

    function acceptAnswer(answer) {
      answer = {sdp : answer.RTCDescription, type: "answer", emitter: answer.emitter};
      console.log("Accepting answer : ", answer);
      _connection.setRemoteDescription(
        new window.RTCSessionDescription(answer), function() {
          console.log("Added answer as local description : ", answer);
        },
        function (error) {
          console.log(error);
        }
      );
    }

    function acceptOffer (offer) {
      offer = {sdp: offer.RTCDescription, type: "offer", emitter: offer.emitter};
      _connection.setRemoteDescription(
        new window.RTCSessionDescription(offer), function () {
          _connection.createAnswer(
            function (description) {
              onDescriptionReceived(description, offer.emitter, offer.type);
              _recipient = offer.emitter;
            },
            function (error) {
              console.log(error);
            });
        },
        function (error) {
          console.log(error);
        });
    }

    function _postIceCandidate(candidate, recipient_id) {
      var data = {ice: candidate, recipient: recipient_id};
        RestService.post('/webrtc/ice', data)
          .then(function (request) {
              console.log(request.data);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    function _postOffer (RTCDescription, recipient_id, type) {
      if (undefined === type) {
        type = "sdp-offer";
      }
      var data = {RTCDescription: $base64.encode(RTCDescription.sdp), recipient: recipient_id, type: type};
      RestService.post("/webrtc/offer", data)
        .then(function (request) {
          console.log(request.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    function createOffer (recipient_id) {
      _recipient = recipient_id;
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
      _connection = new window.RTCPeerConnection(_iceConfig);
    }

    function refuseOffer (offer) {
    }

    function parseData (offers) {
      _offers = [];
      _answers = [];
      _ice = [];
      angular.forEach(offers, function (offer) {
        switch (offer.type) {
          case 'sdp-offer':
            offer.RTCDescription = $base64.decode(offer.RTCDescription);
            _offers.push(offer);
            break;
          case 'sdp-answer':
            offer.RTCDescription = $base64.decode(offer.RTCDescription);
            acceptAnswer(offer);
            _answers.push(offer);
            break;
          case 'ice':
            if (undefined !== _recipient) {
              _ice.push(offer);
              _connection.addIceCandidate(new window.RTCIceCandidate(offer.ice));
            }
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