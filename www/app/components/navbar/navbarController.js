angular.module('confessions.navbar', []).
controller('navbarController', function ($scope, $window, $state, $rootScope, STATES) {

    $scope.title = 'The Confessions';
    $scope.isHomePage = true;

    $scope.navigateBack = function () {
        $window.history.back();
    };

    $rootScope.$on('$stateChangeSuccess', function () {
        if ($state.current.data)
            $scope.title = $state.current.data.navTitle;
        $scope.isHomePage = $state.current.name == 'home';
    });

    $scope.states = STATES.filter(function (state) {
        return state.showInNav || state.slug == 'home';
    });

});
