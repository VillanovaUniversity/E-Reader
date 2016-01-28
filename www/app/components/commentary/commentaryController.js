angular.module('confessions.commentary', []).
controller('commentaryController', function ($scope, $state) {

}).
controller('commentController', function ($scope, $stateParams, $modal, $http) {
    init();

    function init() {
        $http.get('content/json/commentaries.json')
            .then(function (res) {

                var commentaries = res.data;

                var commentNumber = $stateParams.commentNumber;

                if (commentaries[commentNumber - 1].id == commentNumber)
                    $scope.commentaryData = commentaries[commentNumber - 1];
                else {
                    $.each(commentaries, function (index, elm) {
                        if (elm.id == commentNumber)
                            $scope.commentaryData = elm;
                    });
                }
                $scope.URL = "content/commentaries/" + $scope.commentaryData.filename;
            });


        $.getJSON('content/json/bios.json', function (data) {
            $scope.bios = [];
            $scope.$apply(function () {
                $scope.bios = data;
            });

        });

        $scope.showContributorModal = function (name) {

            // Get bio from name
            var author;
            for (var i = 0; i < $scope.bios.length; i++) {
                if ($scope.bios[i].Name.indexOf(name) > -1) {
                    author = $scope.bios[i];
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

    }

}).controller('authorModalCtrl', function ($scope, $modal, $modalInstance, author) {

    $scope.contributor = author;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
