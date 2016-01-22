angular.module('confessions.audio', []).
controller('audioController', function ($scope, $state, $modal, $http, FileCache) {

    var rootURL = "http://www1.villanova.edu/content/dam/villanova/Mobile%20Apps/Augustine's%20Confessions/Audio/";

    $scope.tracks = [];


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

    FileCache.ready.then(function (list) {

        $http.get('content/json/audio.json')
            .then(function (res) {
                FileCache.list().then(function (fileURLs) {

                    //add information to each track
                    angular.forEach(res.data, function (track) {

                        var url = rootURL + track.File;

                        // set URL   
                        track.url = url;

                        // Note if track is cached.
                        if (FileCache.isCached(url)) {
                            $scope.$apply(function () {
                                track.cacheStatus = 'Saved';
                            });
                        }

                    });
                });

                $scope.tracks = res.data;

            });

        var onprogress = function (e) {
            var progress = "Progress: " + e.queueIndex // current download index 
                + " of " + e.queueSize; // total files to download
            //console.log('In onprogress: ' + progress);
        }

        $scope.toggleCacheTrack = function (track) {
            if (FileCache.isCached(track.url)) {
                if (confirm('Remove ' + track.Title + ' from cache?'))
                    removeTrackFromCache(track);
            } else {
                $scope.cacheTrack(track);
            }
        }

        var removeTrackFromCache = function (track) {
            FileCache.remove(track.url);
            track.cacheStatus = null;
        }

        $scope.cacheTrack = function (track) {
            console.log('caching...');
            console.log('url: ' + track.url);
            FileCache.add(track.url);

            track.cacheStatus = 'Downloading';

            // Try to Download files. 
            FileCache.download().then(function (FileCache) {

                // once downloaded
                $scope.$apply(function () {
                    track.cacheStatus = 'Saved';
                });

                console.log('File downloaded. FileCache:');
                console.log(FileCache);
            }, function (failedDownloads) {

                $scope.$apply(function () {
                    track.cacheStatus = null; // reset so user can download again.
                });
                alert("\"" + track.Title + "\" failed to download.");
                console.log('Failed to download the following files:');
                console.log(failedDownloads);
            });

        }

        $scope.playingTrack = '';
        $scope.play = function (track) {
            console.log('playing...');
            $scope.playingTrack = track;

            // This complicated logic should be refactored. Do so carefully; a cleaner approach may cause playback issues. 
            var audioPlayer = document.getElementById('audioPlayer');
            audioPlayer.pause();
            audioPlayer.title = track.Title;
            audioPlayer.src = FileCache.toURL(track.url); // defaults to web URL if not cached.
            console.log(audioPlayer.src);
            audioPlayer.load();
            audioPlayer.play();
        }

    });

}).controller('authorModalCtrl', function ($scope, $modal, $modalInstance, author) {

    $scope.contributor = author;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});