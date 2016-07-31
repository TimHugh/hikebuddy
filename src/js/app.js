const angular = require('angular');

module.exports = angular.module('hikebuddy', []).

  controller('ctrl', ($scope) => {
    $scope.title = "This is a title!";
  });
