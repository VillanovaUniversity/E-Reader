angular.module('confessions.index', []).
controller('indexcontroller', function ($scope, $window, $state, $rootScope) {

    $scope.isHomePage = true;

    $rootScope.$on('$stateChangeSuccess', function () {
        $scope.isHomePage = $state.current.name == 'home';
    });

    // Show loading message
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        $scope.loading = true;
        $('#loadingSpinner').removeClass('ng-hide');
    });
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $scope.loading = false;
        $('#loadingSpinner').addClass('ng-hide');
    });

});
