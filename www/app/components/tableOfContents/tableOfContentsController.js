angular.module('confessions.tableOfContents', []).
controller('tableOfContentsController', function ($scope, books) {
    $scope.books = books.data;
});
