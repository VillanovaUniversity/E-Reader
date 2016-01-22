angular.module('confessions.settings', []).
controller('settingsController', function ($scope, $http, DEVICE) {
    // Load version number from cordova config or package.json
        $http.get('../package.json')
        .success(function(packageInfo) {
            $scope.version=packageInfo.version;
        })
        .error(function(){
            console.log('error. using getappversion');
            console.log(cordova.getAppVersion.getVersionNumber());
            cordova.getAppVersion.getVersionNumber()
            .then(function (version) {
                $scope.$apply(function(){
                    $scope.version = version;
                });
            });
        });
    
    $scope.platform = DEVICE.platform || 'Web';
});
