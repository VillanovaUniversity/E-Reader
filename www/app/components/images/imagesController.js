angular.module('confessions.images', []).
controller('imagesController', function ($scope) {}).
controller('imageController', function ($scope, $stateParams) {
    init();

    function init() {
        $.getJSON('content/json/images.json', function (data) {
            $scope.$apply(function () {



                $scope.Images = [];
                $scope.Images = data;
                var imageNumber = $stateParams.imageNumber;
                imageNumber--;

                $scope.previousPage = imageNumber;
                $scope.nextPage = imageNumber + 2;
                $scope.nextPage = Math.min($scope.nextPage, $scope.Images.length);

                $scope.ImageData = $scope.Images[imageNumber];

            });
        });
    }

    $scope.dataPoints = [
        {
            key: 'Artist',
            label: 'Artist',
        },
        {
            key: 'Copyright',
            label: 'Copyright',
        },
        {
            key: 'Medium',
            label: 'Composition',
        },
        {
            key: 'Location',
            label: 'Location',
        },
        {
            key: 'Date',
            label: 'Created',
        },

    ];

});