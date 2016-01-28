angular.module('confessions.gallery', []).
controller('galleryController', function ($scope) {

    $scope.Images = [];
    $.getJSON('content/json/images.json', function (data) {
        $scope.$apply(function () {
            $scope.Images = data;
        });
    });

});