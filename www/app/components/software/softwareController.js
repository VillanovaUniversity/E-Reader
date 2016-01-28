angular.module('confessions.software', ['angular.filter'])
    .controller('softwareController', function ($scope, $http) {
        $http
            .get('content/json/software.json')
            .then(function (response) {
                $scope.Software = response.data;
            });
        $http
            .get('content/json/licenses.json')
            .then(function (response) {
                $scope.licenses = response.data;
            });
    
    });