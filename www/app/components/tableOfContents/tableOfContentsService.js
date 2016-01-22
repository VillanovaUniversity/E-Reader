angular.module('confessions.tableOfContents').
factory('booksRequest', function ($q, $http) {
    console.log('loading books...');
    return $http.get('content/json/index.json');
});
