angular.module('confessions.map', [])
    .controller('mapController', function ($scope, $state, $http, $timeout) {

        angular.element(document).ready(function () {


            myScroll = new IScroll('#wrapper', {
                zoom: true,
                scrollX: true,
                scrollY: true,
                mouseWheel: true,
                wheelAction: 'zoom',
                zoomStart: .4,
                zoomMax: 1,
                zoomMin: .4,
                freeScroll: true,
                HWCompositing: false,
            });

            myScroll.zoom(.4, undefined, undefined, 1000);
            myScroll.on('beforeScrollStart', clearActiveLocation);
            myScroll.on('zoomStart', clearActiveLocation);

            $http.get('content/json/Journey.json')
                .then(function (res) {
                    $scope.locations = res.data;
                    //                    $scope.activeLocation = $scope.locations[6];
                });


        });

        $scope.load = function (location, $event) {
            var time = 1000;
            zoomOn($event.target, 3, time);
            $timeout(function () {

                var scrollTop = $(window).scrollTop(),
                    elementOffset = $($event.target).offset().top;
                location.screenTop = (elementOffset - scrollTop);

                $scope.activeLocation = location;
            }, time+50);
        }

        function zoomOn(element, zoomLevel, time) {
            myScroll.zoom(1, undefined, undefined, time);
            myScroll.scrollToElement(element, time, true, true)
            myScroll.zoom(zoomLevel, undefined, undefined, time);
        }

        function clearActiveLocation() {
            $scope.$apply(function () {
                $scope.activeLocation = null;
            });
        }

    });