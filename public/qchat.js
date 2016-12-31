'use strict';
var qchat = angular.module('qchat', ['ngSanitize'])
.run(function () {
            console.log('Application is running')
    })
.controller('qchatCtrl',['$scope', function ($scope) {
        $scope.qchat = 'QuickChat';
}]);