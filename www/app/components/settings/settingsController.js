angular.module('confessions.settings', []).
controller('settingsController', function ($scope, $http, DEVICE, $modal) {
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
    
    $scope.showModal = function (title, filename) {
        
        $scope.modalTitle = title;
        
        $http({
          method: 'GET',
              url: 'content/HTML/'+filename+'.html'
          }).then(function successCallback(response) {
              $scope.modalContent = response.data;
          }, function errorCallback(response) {
          });
        
        $modal.open({
            animation: true,
            templateUrl: 'modal.html',
            scope: $scope
        });
    }
});
