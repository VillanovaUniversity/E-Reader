angular.module('confessions', [
    'ui.router',
//    'angular.filter',
    'confessions.navbar',
    'confessions.home',
    'confessions.reader',
    'confessions.tableOfContents',
    'ui.bootstrap',
    'ngTouch',
//    'ngAnimate',
    'confessions.timeline',
    'confessions.contributors',
    'confessions.contributor',
    'confessions.gallery',
    'confessions.audio',
    'confessions.map',
    'confessions.settings',
    'confessions.commentaries',
    'confessions.images',
    'confessions.commentary',
    'confessions.useTerms',
    'confessions.privacy',
    'confessions.citations',
    'confessions.index',
    'confessions.developers',
	'confessions.software'

]).
constant('STATES', [
    {
        slug: 'home',
        label: "Home",
        showInNav: false
    },
    {
        slug: 'tableOfContents',
        label: "Books",
        showInNav: true,
        resolve: {
            books: 'booksRequest'
        }
    },
    {
        slug: 'reader',
        label: "Name of the Text",
        showInNav: false
    },
    {
        slug: 'commentaries',
        label: "Commentaries",
        showInNav: true
    },
    {
        slug: 'commentary',
        label: "Commentary",
        showInNav: false
    },
    {
        slug: 'contributors',
        label: "Contributors",
        showInNav: true
    },
    {
        slug: 'gallery',
        label: "Gallery",
        showInNav: true
    },
    {
        slug: 'images',
        label: "Gallery",
        showInNav: false
    },
    {
        slug: 'audio',
        label: "Audio",
        showInNav: true
    },
    {
        slug: 'timeline',
        label: "Timeline",
        showInNav: true
    },
    {
        slug: 'map',
        label: "Journey",
        showInNav: true
    },
    {
        slug: 'settings',
        label: "About",
        showInNav: true
    },
    {
        slug: 'privacy',
        label: "Privacy Policy",
        showInNav: false
    },
    {
        slug: 'citations',
        label: "Citations",
        showInNav: false
    },
    {
        slug: 'developers',
        label: "Developers",
        showInNav: false
    },
    {
        slug: 'useTerms',
        label: "Terms of Use",
        showInNav: false
    },
    {
        slug: 'software',
        label: "Software Licenses",
        showInNav: false
    }
]).
config(function ($stateProvider, $urlRouterProvider, $locationProvider, STATES, $compileProvider) {

    // For any unmatched url, send to /home
    $urlRouterProvider.otherwise("/home");


    // Add routing for each view
    $.each(STATES, function (ind, state) {
        var view = state.slug;
        $stateProvider.state(view, {
            url: "/" + view,
            templateUrl: "app/components/" + view + "/" + view + "View.html",
            controller: view + 'Controller',
            data: {
                navTitle: state.label,
                showInNav: state.showInNav,
            },
            resolve: state.resolve,
        });
    });

    // Add routing for each book
    $stateProvider.state('reader.books', {
        url: '/books/:bookNumber',
        templateUrl: function (stateParams) {
            return "content/compiledHTML/book" + stateParams.bookNumber + '.html';
        },
        controller: "bookController"
    });

    // Add routing for each image
    $stateProvider.state('image', {
        url: '/image/:imageNumber',
        templateUrl: 'app/components/images/imagesView.html',
        controller: "imageController"
    });

    // Add routing for each commentary
    $stateProvider.state('comment', {
        url: '/comment/:commentNumber',
        templateUrl: 'app/components/commentary/commentaryView.html',
        controller: "commentController"
    });


    // Add routing for each timeline Event
    $stateProvider.state('timeline.event', {
        url: "#timeline:timelineNumber",
        templateUrl: "app/components/timeline/timelineView.html",
        controller: "timelineController"
    });

    // Whitelist some URL patterns
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data|content|file):/);

}).
run(function ($rootScope, $location, $anchorScroll) {

        // Change offset when scrolling to anchor in page to account for header.
        $anchorScroll.yOffset = function () {
            return $('.navbar.navbar-default.navbar-fixed-top.ng-scope').outerHeight() + 20;
        }

        // Initialize fastclick for better mobile performance
        FastClick.attach(document.body);

        // Enable rotation
        window.shouldRotateToOrientation = function (degrees) {
            return true;
        }

        //when the route is changed scroll to the proper element.
        $rootScope.$on('$viewContentLoaded', function (newRoute, oldRoute) {
            if ($location.hash()) {
                $anchorScroll();
            }
        });

        // Cordova Events
        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {

            // Hide splash screen after some time.
            setTimeout(function () {
                navigator.splashscreen.hide();
            }, 2000);
        }

    })
    .directive('stopEvent', function () {
        // Fix for bug:     https://github.com/angular-ui/bootstrap/issues/2017
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.on(attr.stopEvent, function (e) {
                    e.stopPropagation();
                });
            }
        };
    })
    .service('DEVICE', function () {
        var d;
        document.addEventListener("deviceready", function () { // device only accessible on device and when device is ready.
            d = device;
        }, false);

        return d;
    })
    .service('FileCache', function () {
        // Initialize a Cache
        return new CordovaFileCache({
            fs: new CordovaPromiseFS({ // An instance of CordovaPromiseFS is REQUIRED
                Promise: angular.$q // <-- your favorite Promise lib (REQUIRED)
            }),
            mode: 'hash', // 'hash' or 'mirror', optional
            localRoot: 'data', //optional
//            serverRoot: 'http://yourserver.com/files/', // optional, required on 'mirror' mode
            cacheBuster: false // optional
        });
    });