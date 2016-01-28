angular.module('confessions.timeline', []).
controller('timelineController', function ($scope, $location, $anchorScroll, $window) {
    $.getJSON('content/json/timeline.json', function (data) {        
        $scope.Events = [];
        $scope.$apply(function () {
            $scope.Events = data;
        });
        
            // Scroll to anchor once content is loaded
            $window.setTimeout(function () {
                    if ($location.hash()) {
                        $anchorScroll();
                    }
                },
                500);
        

    });

    var histCheckBox = true;
    var augCheckBox = false;
    
    var expr1 = {
        Relation: 'AugustinianEvent'
    };
    var expr2 = {
        Relation: ''
    };

    $scope.filterExpr = expr1;
    $scope.checkBox = augCheckBox;
    $scope.changeFilter = function () {
        $scope.filterExpr = $scope.filterExpr == expr1 ? expr2 : expr1;
        
        $scope.checkBox = $scope.checkBox == augCheckBox ? histCheckBox : augCheckBox;
        
        document.getElementById('timelineDisplayCheckbox').checked = $scope.checkBox;
    }
});
