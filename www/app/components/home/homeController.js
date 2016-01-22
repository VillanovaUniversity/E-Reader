angular.module('confessions.home', []).
controller('homeController', function ($scope, STATES) {


    $scope.views = STATES.filter(function (state) {
        return state.showInNav;
    });

    $scope.percentage = 100 / $scope.views.length;
});
