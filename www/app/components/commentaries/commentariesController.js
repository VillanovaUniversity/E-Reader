 var unique = function (data, key) {
     var result = [];
     for (var i = 0; i < data.length; i++) {
         var value = data[i][key];
         if (result.indexOf(value) == -1) {
             result.push(value);
         }
     }

     return result;
 };

 angular.module('confessions.commentaries', []).
 controller('commentariesController', function ($scope, $state, $q, $modal) {

     $.getJSON('content/json/bios.json', function (data) {
         $scope.bios = [];
         $scope.$apply(function () {
             $scope.bios = data;
         });

     });

     $.getJSON('content/json/commentaries.json', function (data) {
         $scope.Commentaries = [];
         $scope.Books = [];

         $scope.$apply(function () {
             $scope.Commentaries = data;

             var booksDeferred = $q.defer();

             // return a promise. The promise says, "I promise that I'll give you your
             // data as soon as I have it (which is when I am resolved)".
             $scope.Books = booksDeferred.promise;

             // create a list of unique teams
             var uniqueBooks = unique($scope.Commentaries, 'relation');

             // resolve the deferred object with the unique teams
             // this will trigger an update on the view
             booksDeferred.resolve(uniqueBooks);
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

     $scope.openCommentary = function (commentary) {
         $state.go("comment", {
             commentNumber: commentary.id,
         });
     };


 }).controller('authorModalCtrl', function ($scope, $modal, $modalInstance, author) {

     $scope.contributor = author;

     $scope.cancel = function () {
         $modalInstance.dismiss('cancel');
     };
 });
