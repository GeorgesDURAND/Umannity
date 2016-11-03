/* global RTCPeerConnection */
(function () {
    'use strict';

    angular
        .module('umannityApp.services')
        .factory('WebRTCService', webRTCService);

    webRTCService.$inject = ['$q', 'RestService'];

    function webRTCService($q, RestService) {
        var _iceConfig = {'iceServers': [{'urls': 'stun:umannity.com:3478'}]};
        var _separator = "&`|";
        var _connection;
        var _sdpConstraints = {
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
        };
        var _SDPOffer;

        var service = {
            getOffers: getOffers,
            connectRTC: connectRTC,
            createOffer: createOffer
        };

        return service;

        ////

        function postOffer(SDPOffer, recipient_id) {
            var data = {offer: SDPOffer.sdp.replace(/[\n\r]/g, _separator), recipient: recipient_id};
            RestService.post("/webrtc/offer", data)
                .then(function (request) {
                    console.log(request.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        function createOffer(recipient_id) {
            _connection
                .createOffer(
                    function (SDPOffer) {
                        _connection.setLocalDescription(SDPOffer);
                        _SDPOffer = SDPOffer;
                        console.log(_SDPOffer);
                        postOffer(SDPOffer, recipient_id);
                    },
                    function (error) {
                        console.log(error);
                    },
                    _sdpConstraints);
        }

        function connectRTC() {
          var _RTCPeerConnection = webkitRTCPeerConnection || RTCPeerConnection;
            _connection =  new _RTCPeerConnection(_iceConfig);
        }

        function getOffers() {
            var deferred = $q.defer();
            RestService.get("/webrtc/offers")
                .then(function (request) {
                    var parsedOffers = [];
                    angular.forEach(request.data.offers, function(offer) {
                        var parsedOffer = offer.SDPOffer.replace(_separator, "\n").replace(_separator, "\r");
                        offer.SDPOffer = parsedOffer;
                        parsedOffers.push(offer);
                    });
                    deferred.resolve(parsedOffers);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

    }

})();