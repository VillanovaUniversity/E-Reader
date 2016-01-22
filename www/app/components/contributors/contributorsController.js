angular.module('confessions.contributors', ['ngSanitize']).
controller('contributorsController', function ($scope, $modal) {

    var bios;
    $.getJSON('content/json/bios.json', function (data) {
        bios = data;
        $scope.Contributors = [];
        $scope.$apply(function () {
            $scope.Contributors = data;
        });
        $scope.toggle = function () {
            $scope.check = $scope.check === false ? true : false;
        }
    });

    $scope.showContributorModal = function (name) {


        // Get bio from name
        var author;
        for (var i = 0; i < bios.length; i++) {
            if (bios[i].Name.indexOf(name) > -1) {
                author = bios[i];
            }
        }

        $modal.open({
            animation: true,
            templateUrl: 'app/components/contributor/contributorView.html',
            controller: 'authorModalCtrl',
            resolve: {
                author: function () {
                    return author;
                }
            },
        }).result.then(function (selectedItem) {}, function () {});
    }

    $scope.categories = [{
            label: 'All',
            filterStr: ''
        }, {
            label: 'Commentators',
            filterStr: 'Commentator'
        }, {
            label: 'Readers',
            filterStr: 'Audio'
        }, {
            label: 'Photographers',
            filterStr: 'Photography'
        }, {
            label: 'Artists',
            filterStr: 'Art'
        }, {
            label: 'Cartography',
            filterStr: 'Map'
        }, {
            label: 'Editors',
            filterStr: 'Edit'
        }
     ];

    $scope.activeCategoryStr = '';

    $scope.changeFilter = function (categoryStr) {
        $scope.activeCategoryStr = categoryStr;
        $scope.filterExpr = {
            Contribution: categoryStr
        };
    }

}).controller('authorModalCtrl', function ($scope, $modal, $modalInstance, author) {

    $scope.contributor = author;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
