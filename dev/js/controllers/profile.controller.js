(function () {
  'use strict';

  angular
    .module('umannityApp.controllers')
    .controller('profileController', profileController);

  profileController.$inject = ['$scope', 'UserService'];

  function profileController ($scope, UserService) {
    /* jshint validthis: true */
    var vm = this;
    vm.edited_user = {};
    vm.editProfile = editProfile;
    vm.name = "profileController";
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

    function editProfile () {
      console.log("editdProfileController");
      if (undefined != vm.edited_user) {
        console.log("not undefinned");
        UserService.editProfile(vm.edited_user)
      }
    }
  }
})();
