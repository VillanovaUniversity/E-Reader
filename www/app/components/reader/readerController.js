angular.module('confessions.reader', ['ui.router']).
controller('readerController', function ($scope, $stateParams, voicePlayer, annotator, annotations) {}).
controller('readerToolsController', function ($scope, $window, voicePlayer, $stateParams, $modal, bookmarks, $sce, $timeout) {

    var bookNumber = $stateParams.bookNumber;
    var rootURL = "http://www1.villanova.edu/content/dam/villanova/Mobile%20Apps/Augustine's%20Confessions/Audio/";
    $scope.audioSRC = $sce.trustAsResourceUrl(rootURL + 'book' + bookNumber + '.mp3'); //https://docs.angularjs.org/api/ng/service/$sce
    bookmarks.loadBook(bookNumber);

    $scope.selectedText = "";

    $scope.showAnnotationSelect = function () {
        $modal.open({
            animation: true,
            templateUrl: 'annotationSelectModal.html',
            controller: 'annotationSelectController',
            size: 'sm',
            resolve: {},
        });
    };

    $scope.showBookmarkModal = function () {
        $modal.open({
            animation: true,
            templateUrl: 'bookmarkModal.html',
            controller: 'bookmarkModalController',
            resolve: {},
        });
    };

    $scope.showSearchModal = function () {
        $modal.open({
            animation: true,
            templateUrl: 'searchTemplate.html',
            size: 'sm',
            controller: 'searchController'
        });
    };

    $scope.showJumpModal = function () {
        $modal.open({
            animation: true,
            templateUrl: 'jumpTemplate.html',
            size: 'sm',
            controller: 'jumpController'
        });
    }

    $scope.voicePlayer = voicePlayer;
    $scope.showPlayer = false;
    $scope.playerPlaying = false;

    $scope.voiceoverToggle = function () {
        if (!voicePlayer.isInitialized)
            $scope.voiceplayerInitializing = true;

        $timeout(function () { // Pause to give view chance to refresh & display loading message.
            voicePlayer.toggle();
            $scope.showPlayer = !voicePlayer.paused();
            $scope.voiceplayerInitializing = false;
        }, 50);

    }

}).controller('bookmarkModalController', function ($scope, annotationTypes, $modalInstance, bookmarks) {
    $scope.annotationTypes = annotationTypes.getAll();
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.newBookmarkName = '';
    $scope.addBookmark = function () {
        bookmarks.add($scope.newBookmarkName, getFirstParOnScreenIndex());
        $scope.newBookmarkName = '';
    };
    $scope.bookmarks = bookmarks;

    $scope.listOfBookmarks = bookmarks.getAll();

    function getFirstParOnScreenIndex() {
        var firstParIndex;
        $('p').each(function (i, p) {
            if (p.getBoundingClientRect().top >= 0) {
                firstParIndex = i;
                return false; // break loop
            }
        });
        return firstParIndex;
    }
}).controller('bookController', function ($scope, $stateParams, voicePlayer, annotator, annotations, $anchorScroll, annotationTypes, $state) {

    var bookNumber = $stateParams.bookNumber;



    $scope.$on('$viewContentLoaded', function () {

        console.log('Book Controller view content Loaded. ');

        setTimeout(function () { // Pause to give view chance to refresh & display loading message.
            $scope.$apply(function () {
                init();
            });

            $anchorScroll();

        }, 500);

        //console.log('Done initialization');
    });

    function init() {
        console.log('initializing book controller');

        voicePlayer.clear();

        //console.log('Loading Annotator annotations');
        annotator.loadAnnotations();

        annotations.init(bookNumber);

        angular.forEach(annotationTypes.getAll(), function (annType) {
            if (!annType.visible)
                annType.hide();
        });

        console.log('Done initialization');
    }

}).controller('searchController', function ($scope, $window, $modalInstance, screenPosition, $modalInstance) {

    $scope.term = '';
    $scope.numResults;

    var container = document.getElementById('bookView');
    var input = document.getElementById('find');

    var instance;
    var results = [];

    var activeRes;
    $('search-result').contents().unwrap('search-result');

    $scope.search = function () {

        instance && instance.revert();
        $('search-result.active').removeClass('active');


        $scope.numResults = 0;
        results = [];

        if ($scope.term) {
            var called = false;
            try {
                var regex = RegExp($scope.term, 'gi');
            } catch (e) {
                return;
            }
            try {
                instance = findAndReplaceDOMText(container, {
                    find: regex,
                    replace: function (portion, match) {
                        // Called whenever something is found.

                        called = true;
                        var el = document.createElement('search-result');
                        el.innerHTML = portion.text;

                        results.push(el);

                        $scope.numResults++;

                        return el;
                    },
                    preset: 'prose'
                });

                if (results.length > 0)
                    setActiveResult(results[0]);

            } catch (e) {
                console.error('Error: ' + e);
                throw e;
                return;
            }

        }
    };

    $scope.next = function () {
        var curIndex = results.indexOf(activeRes);
        var newIndex = curIndex + 1;
        if (newIndex >= results.length)
            newIndex = 0;
        setActiveResult(results[newIndex]);
    };

    $scope.previous = function () {
        var curIndex = results.indexOf(activeRes);
        var newIndex = curIndex - 1;
        if (newIndex < 0)
            newIndex = results.length - 1;
        setActiveResult(results[newIndex]);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    function setActiveResult(newActiveRes) {
        if (activeRes != null)
            activeRes.classList.remove('active');
        newActiveRes.classList.add('active');
        screenPosition.scrollTo(newActiveRes)
        activeRes = newActiveRes;
    }

}).controller('annotationSelectController', function ($scope, annotationTypes, $modalInstance) {
    $scope.annotationTypes = annotationTypes.getAll();
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}).controller('jumpController', function ($scope, annotationTypes, $modalInstance, $anchorScroll) {
    $modalInstance.rendered.then(function () {
        var select = $(".jumpModalBody select");
        select.append("<option value='#' disabled='disabled' class='disabled' selected='selected'>Choose...</option>")
        $("#bookView h3").each(function () {
            select.append("<option value='" + $(this).attr("id") + "'>" + $(this).html() + "</option>");
        });
        $(".jumpModalBody select option").eq(0).remove();
    });

    $scope.change = function () {
        $anchorScroll($scope.jumpSelectModel);
        $scope.cancel();
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}).directive('annotation', function ($modal, annotations) {
    return {
        restrict: 'E',
        scope: {
            anid: '@',
            type: '@',
            clickable: '@',
        },
        controller: function ($scope, annotationTypes, directiveCounter, $stateParams) {
            var count;
            var isPlaceholder = $scope.clickable == 'false';
            $scope.show = $scope.anid || isPlaceholder;
            if ($scope.show && !isPlaceholder)
                count = directiveCounter.getAndIncrement($stateParams.bookNumber + '.annotation.' + $scope.type);
            $scope.contents = count ? count : ($scope.anid ? $scope.anid : "&zwnj;");


            $scope.open = function (anid) {

                if ($scope.clickable == 'false')
                    return false;

                $modal.open({
                    animation: true,
                    templateUrl: 'annotationModal.html',
                    controller: 'annotationModalController',
                    resolve: {
                        annotation: function () {
                            return annotations.get($scope.type, anid);
                        },
                        displayNumber: function () {
                            return $scope.contents;
                        },
                    },
                });
            };

        },
        template: '<button class="{{::type}}" ng-click="open({{::anid}})" ng-if="::show" ng-bind-html="contents"></button>'
    };
})
.directive('timelinelink', function () {
    var uniqueId = 0;
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            tn: '@'
        },
        controller: function ($scope, $state, $stateParams) {
            var bookNumber = $stateParams.bookNumber;
            $scope.externalLink = function ($event) {
                console.log($event);
                var id = $event.target.parentNode.id
                    // Place the anchor just clicked in history before navigating away from book (so people can return to where they left off)
                $state
                    .go('reader.books', {
                        bookNumber: bookNumber,
                        '#': id // get parent, because the click hits the ng-scope span.
                    });
                uniqueId = 0;
            }
        },
        template: '<a id="{{::uniqueId}}" ng-click="externalLink($event)" ui-sref="timeline.event({timelineNumber:tn})" class="timeline" ng-transclude></a>',
        link: function (scope, elem, attrs) {
            scope.uniqueId = 'timelinelink' + uniqueId++;
        }
    };
})
.directive('imagelink', function () {
    var uniqueId = 0;
    return {
        restrict: 'E',
        transclude: true,
        scope: { in : '@'
        },
        controller: function ($scope, $state, $stateParams) {
            var bookNumber = $stateParams.bookNumber;
            $scope.externalLink = function ($event) {
                console.log($event);
                var id = $event.target.parentNode.id
                    // Place the anchor just clicked in history before navigating away from book (so people can return to where they left off)
                $state
                    .go('reader.books', {
                        bookNumber: bookNumber,
                        '#': id // get parent, because the click hits the ng-scope span.
                    });
                uniqueId = 0;
            }
        },
        template: '<a id="{{::uniqueId}}" ng-click="externalLink($event)" ui-sref="image({imageNumber:in})" class="gallery" ng-transclude></a>',
        link: function (scope, elem, attrs) {
            scope.uniqueId = 'imagelink' + uniqueId++;
        }
    };
})
.controller('annotationModalController', function ($scope, $modalInstance, annotation, displayNumber) {

    $scope.annotation = annotation;
    $scope.displayNumber = displayNumber;


    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});