/* global RTCPeerConnection */
(function () {
    'use strict';

    angular
        .module('umannityApp.services')
        .factory('WebRTCService', webRTCService);

    webRTCService.$inject = ['$q', '$base64', 'RestService'];

    function webRTCService($q, $base64, RestService) {
        //Multi-browser globals config hacks
        window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
        window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
        window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

        //Local variables
        var _iceConfig = {'iceServers': [{'urls': 'stun:umannity.com:3478'}]};
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
        var _disconnectCallback, _connectCallback, _pendingCallback;
        var peerConnections = {};

        var service = {
            getOffers: getOffers,
            acceptOffer: acceptOffer,
            refuseOffer: refuseOffer,
            createOffer: createOffer,
            deleteOffers: deleteOffers,
            getExternalMediaStream: getExternalMediaStream,
            init: init
        };

        return service;

        ////

        function init(stream, connectCallback, disconnectCallback, pendingCallback) {
            _stream = stream;
            // _connection = new window.RTCPeerConnection(_iceConfig);
            // _connection.onaddstream = onAddStream;
            // _connection.oniceconnectionstatechange = onIceConnectionStateChange;
            _connectCallback = connectCallback;
            _disconnectCallback = disconnectCallback;
            _pendingCallback = pendingCallback;
        }

        function getPeerConnection(id) {
            if (peerConnections[id]) {
                return peerConnections[id];
            }
            var pc = new RTCPeerConnection(_iceConfig);
            peerConnections[id] = pc;
            pc.addStream(_stream);
            pc.onicecandidate = onIceCandidate;
            pc.onaddstream = onAddStream;
            pc.oniceconnectionstatechange = onIceConnectionStateChange;
            return pc;
        }

        function onIceConnectionStateChange(peerConnection) {
            var state = peerConnection.iceConnectionState;
            console.log("Connection state changed", state);

            switch (state) {
                case 'disconnected':
                    _disconnectCallback(state);
                    break;
                case 'connected':
                    _connectCallback(state);
                    break;
                case 'checking':
                    _pendingCallback(state);
                    break;
                default:
                    _pendingCallback(state);
                    break;
            }
        }

        function getExternalMediaStream() {
            return _externalStream;
        }

        function onAddStream(event) {
            console.log("Got new stream :: ", event);
            _externalStream = event.stream;
        }

        function onIceCandidate(event) {
            console.log("Got ice candidate", event.candidate);
            if (undefined !== _recipient) {
                if (null !== event.candidate) {
                    _postIceCandidate(event.candidate, _recipient);
                }
            }
        }

        function acceptAnswer(answer) {
            var peerConnection = getPeerConnection(answer.emitter);
            answer = {sdp: answer.RTCDescription, type: "answer", emitter: answer.emitter};
            console.log("Accepting answer : ", answer);
            peerConnection.setRemoteDescription(
                new window.RTCSessionDescription(answer), function () {
                    console.log("Added answer as local description : ", answer);
                },
                function (error) {
                    console.log(error);
                }
            );
            deleteOffers().then(function () {

            });
        }

        function acceptOffer(offer) {
            var peerConnection = getPeerConnection(offer.emitter);
            _recipient = offer.emitter;
            offer = {sdp: offer.RTCDescription, type: "offer", emitter: offer.emitter};
            peerConnection.setRemoteDescription(new window.RTCSessionDescription(offer));
            peerConnection.createAnswer(
                function (description) {
                    // onDescriptionReceived(description, offer.emitter, description.type);
                    peerConnection.setLocalDescription(description);
                    _postOffer(description, offer.emitter, "sdp-answer");
                    console.log("recipient : ", _recipient);
                    deleteOffers().then(function () {

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

        function _postOffer(RTCDescription, recipient_id, type) {
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

        function createOffer(recipient_id) {
            var peerConnection = getPeerConnection(recipient_id);
            peerConnection
                .createOffer(
                    function (RTCDescription) {
                        peerConnection.setLocalDescription(RTCDescription);
                        _RTCDescription = RTCDescription;
                        _postOffer(RTCDescription, recipient_id);
                    },
                    function (error) {
                        console.log(error);
                    },
                    _sdpConstraints);
        }

        function refuseOffer(offer) {
        }

        function parseData(offers) {
            _offers = [];
            _answers = [];
            _ice = [];
            angular.forEach(offers, function (offer) {
                var peerConnection = getPeerConnection(offer.emitter);
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
                        console.log("got ice from server : ", offer);
                        console.log("recipient : ", _recipient);
                        if (undefined !== _recipient) {
                            peerConnection.addIceCandidate(new window.RTCIceCandidate(offer.ice));
                        }
                        break;
                }
            });
            return _offers;
        }

        function deleteOffers() {
            var deferred = $q.defer();
            RestService.delete("/webrtc/offers")
                .then(function (request) {
                    deferred.resolve(request.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function getOffers() {
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