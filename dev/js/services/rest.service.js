(function () {
  'use strict';

  angular
    .module('umannityApp.services')
    .factory('RestService', restService);

  restService.$inject = ['$q', '$http', 'ConstantService', '$cookies'];

  function restService ($q, $http, ConstantService, $cookies) {
    var _api_url = ConstantService.api_url;
    var _api_key = $cookies.get('api_key');
    var _type = $cookies.get('type');
    var _isLoading = false;

    var service = {
      get: get,
      post: post,
      put: put,
      delete: _delete,
      setApiKey: setApiKey,
      getApiKey: getApiKey,
      removeApiKey: removeApiKey,
      setType: setType,
      getType: getType,
      removeType: removeType,
      getIsLoading: getIsLoading
    };

    return service;

    ////

    function getIsLoading () {
      return _isLoading;
    }

    function getApiKey () {
      return _api_key;
    }

    function removeApiKey () {
      $cookies.remove('api_key');
    }

    function setApiKey (api_key) {
      $cookies.put('api_key', api_key);
      _api_key = api_key;
    }

    function getType () {
      return _type;
    }

    function removeType(type){
      $cookies.remove('type');
    }

    function setType (type) {
      $cookies.put('type', type);
      _type = type;
    }

    function doRequest (req, showLoader) {
      var deferred = $q.defer();
      if (undefined !== showLoader) {
        _isLoading = showLoader;
      }
      else {
        _isLoading = true;
      }
      $http(req)
        .then(
          function (data) {
            _isLoading = false;
            deferred.resolve(data);
          })
        .catch(
          function (error) {
            _isLoading = false;
            deferred.reject(error);
          });
      return deferred.promise;
    }

    function get (route, data, headers, showLoader) {
      var req = {
        method: 'GET',
        url: _api_url + route,
        headers: {
          'Authorization': _api_key
        },
        params: data
      };
      angular.extend(req.headers, headers);
      return doRequest(req, showLoader);
    }

    function _delete (route, data, headers, showLoader) {
      var req = {
        method: 'DELETE',
        url: _api_url + route,
        headers: {
          'Authorization': _api_key
        },
        params: data
      };
      angular.extend(req.headers, headers);
      return doRequest(req, showLoader);
    }

    function put (route, data, headers, showLoader) {
      var req = {
        method: 'PUT',
        url: _api_url + route,
        headers: {
          'Authorization': _api_key
        },
        data: data
      };
      angular.extend(req.headers, headers);
      return doRequest(req, showLoader);
    }

    function post (route, data, headers, showLoader) {
      var req = {
        method: 'POST',
        url: _api_url + route,
        headers: {
          'Authorization': _api_key
        },
        data: data
      };
      angular.extend(req.headers, headers);
      return doRequest(req, showLoader);
    }

  }
})();