const angular = require('angular');

module.exports = angular.module('hikebuddy', []).

  controller('ctrl', ($scope) => {
    console.log('controller');
    $scope.title = "This is a title!";
  });
