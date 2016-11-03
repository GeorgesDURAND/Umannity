(function () {
  'use strict';

  angular
    .module('umannityApp.controllers')
    .controller('profileController', profileController);

  profileController.$inject = ['$scope', 'UserService'];

  function profileController ($scope, UserService) {
    /* jshint validthis: true */
    var vm = this;
    $scope.$on('$viewContentLoaded', onViewContentLoaded);

    function onViewContentLoaded () {
      //Loading the user
      vm.user = UserService.getUser();
      if (undefined === vm.user) {
        UserService.loadUser()
          .then(function (user) {
            vm.user = user;
          });
      }
      //Loading the picture
      vm.picture = UserService.getPicture();
      if (undefined === vm.picture) {
        UserService.loadPicture()
          .then(function (picture) {
            vm.picture = picture;
          });
      }
    }
  }
})();
