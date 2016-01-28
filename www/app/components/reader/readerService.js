angular
    .module('confessions.reader')
    .factory('screenPosition', function () {
        // Collection of utility methods for elements' positions on screen.

        function centerScreenOn(element) {
            window.scroll(0, $(element).offset().top - window.innerHeight / 2);
        }

        function scrollTo(element) {
            window.scroll(0, element.offsetTop);
        }

        function checkVisible(elm, evalType) {
            evalType = evalType || "visible";

            var vpH = $(window).height(), // Viewport Height
                st = $(window).scrollTop(), // Scroll Top
                y = $(elm).offset().top,
                elementHeight = $(elm).height();

            if (evalType === "visible") return ((y < (vpH + st)) && (y > (st - elementHeight)));
            if (evalType === "above") return ((y < (vpH + st)));
        }

        return {
            centerScreenOn: centerScreenOn,
            scrollTo: scrollTo,
            checkVisible: checkVisible
        };
    })
    .factory('bookmarks', function (Bookmark) {

        var bookNum;
        var localstorageKey;
        var bookmarks = [];

        function loadBook(bookNumber) {

            //giveParsIDs();

            bookNum = bookNumber;
            localstorageKey = 'bookmarks.book' + bookNum;
            bookmarks = JSON.parse(localStorage.getItem(localstorageKey)) || [];
            return bookmarks;
        }

        /*function giveParsIDs() {
            $.each($('p'), function (index, elm) {
                $(elm).attr('id', getID(index));
            });
        }*/

        function getID(index) {
            return 'par' + index;
        }

        function getAll() {
            return bookmarks;
        }

        function save() {
            localStorage.setItem(localstorageKey, JSON.stringify(bookmarks));
        }

        function add(name, parIndex) {
            bookmarks.push(new Bookmark(name, bookNum, parIndex));
            save();
        }

        function remove(bookmark) {
            bookmarks.splice(bookmarks.indexOf(bookmark), 1); //remove element from array
            save();
        }

        return {
            loadBook: loadBook,
            add: add,
            remove: remove,
            getAll: getAll,
            getID: getID,
        }


    }).
factory('Bookmark', function () {
    function Bookmark(name, bookNumber, parIndex) {
        this.name = name;
        this.bookNumber = bookNumber;
        this.parIndex = parIndex;
    }
    return Bookmark;
}).
factory('annotations', function ($state, footnotes, commentaries, teachingtips, directiveCounter) {

    function init(booknum) {
        //        console.log('Initializing Annotations')
        footnotes.init(booknum);
        commentaries.init();
        teachingtips.init();
        directiveCounter.counts = {};

    }

    function get(type, id) {
        if (type == 'footnote') {
            var footnote = footnotes.getFootnote(id);
            return {
                id: footnote.ID,
                content: footnote.content,
                type: type,
                typeName: 'footnote',
                attribution: 'Common Footnote Author',
            }
        } else if (type == 'commentary') {
            var commentary = commentaries.getMeta(id);
            var promise = commentaries.getContent(commentary.id);

            return promise.then(function (commentaryContent) {
                return {
                    id: commentary.numberInBook,
                    content: commentaryContent,
                    type: type,
                    typeName: 'expert commentary',
                    attribution: commentary.author,
                }
            });
        } else if (type == 'teaching-tip') {
            var tip = teachingtips.getTip(id);
            var content = teachingtips.getContent(id);

            return {
                id: id,
                content: content,
                type: type,
                typeName: 'teaching tip',
                attribution: tip.author,
            }
        }
    }

    return {
        get: get,
        init: init,
    }
}).
factory('footnotes', function ($state) {

    var footnotes;

    function init(bookNumber) {
        $.getJSON('content/json/footnotes/Book' + bookNumber + '.json', function (data) {
            footnotes = data;
        });
    }

    function getFootnote(footnoteID) {

        var ret;
        if (footnotes[footnoteID - 1].ID == footnoteID) // Check if it's just in the right spot in the array. If so, we're good.
            ret = footnotes[footnoteID - 1];
        else {

            $.each(footnotes, function (index, footnote) {
                if (footnote.ID == footnoteID) {
                    ret = footnote;
                    return false;
                }
            });

        }
        return ret;

    }

    function getFootnoteContent(footnoteID) {
        return getFootnote(footnoteID).Footnote;
    }

    return {
        init: init,
        getFootnote: getFootnote,
        getFootnoteContent: getFootnoteContent,
    };
}).
factory('teachingtips', function ($state) {

    var tips = [];

    function init() {
        $.getJSON('content/json/teachingtips.json', function (data) {
            tips = data;
            t = tips;
        });
    }

    function getTip(ID) {
        var ret;

        var tip = tips[ID - 1];
        if (tip.ID == ID) {
            ret = tip;
        } else {
            $.each(tips, function (index, tip) {
                if (tip.ID == ID) {
                    ret = tip;
                    return false;
                }
            });
        }

        return ret;

    }

    function getContent(ID) {
        return getTip(ID).content;
    }

    return {
        init: init,
        getContent: getContent,
        getTip: getTip,
    };
}).
factory('commentaries', function ($state, $q) {

    var comDir = 'content/commentaries';
    var commentaries;

    function init(bookNumber) {
        $.getJSON('content/json/commentaries.json', function (data) {
            commentaries = data;
        });
    }

    function getMeta(id) {
        var ret;
        if (commentaries[id - 1].id == id) // Check if it's just in the right spot in the array. If so, we're good.
            ret = commentaries[id - 1];
        else {
            $.each(commentaries, function (index, commentary) {
                if (commentary.id == id) {
                    ret = commentary;
                    return false;
                }
            });
        }
        return ret;
    }

    function getContent(id, callback) {

        if (getMeta(id).filename != '') {

            var deferred = $q.defer();

            $.ajax({
                url: comDir + '/' + getMeta(id).filename,
                success: function (data) {
                    deferred.resolve(data);
                },
                dataType: 'html'
            });

            return deferred.promise;
        } else {
            console.error('Requested commentary has no filename! (ID ' + id + ')');
            return false;
        }


    }

    return {
        init: init,
        getMeta: getMeta,
        getContent: getContent,
    };
}).
factory('annotationTypes', function (AnnotationType) {

        var annTypeNames = ['footnote', 'commentary', 'highlight', 'teaching tips'];
        var annTypes = {};

        //Setup each annotation type.
        annTypes.footnote = new AnnotationType('footnote');
        annTypes.commentary = new AnnotationType('commentary');
        annTypes['teaching-tip'] = new AnnotationType('teaching tip');
        annTypes.highlight = new AnnotationType('highlight', function () {
            // callback to show annotator highlights.
            var elms = $('span.annotator-hl-disabled');
            elms.addClass('annotator-hl');
            elms.removeClass('annotator-hl-disabled');
        }, function () {
            // callback to hide annotator highlights.
            var elms = $('span.annotator-hl');
            elms.addClass('annotator-hl-disabled');
            elms.removeClass('annotator-hl');
        });

        function get(annName) {
            return annTypes[annName];
        }

        function getAll() {
            return annTypes;
        }

        return {
            getAll: getAll,
            get: get,
        }
    })
    .factory('AnnotationType', function () {

        function AnnotationType(name, custShowFunc, custHideFunc) {
            this.name = name;
            this.visible = true;
            this.slug = this.name.replace(' ','-');

            this.selector = "annotation[type='" + this.slug + "']";

            this.showFunc = function () {
                $.each($(this.selector), function (index, elm) {
                    $(elm).removeClass('ng-hide');
                });
                if (custShowFunc)
                    custShowFunc();
            }

            this.hideFunc = function () {
                $.each($(this.selector), function (index, elm) {
                    $(elm).addClass('ng-hide');
                });
                if (custHideFunc)
                    custHideFunc();
            }

        }




        AnnotationType.prototype.show = function () {
            visible = true;
            this.showFunc();
        }

        AnnotationType.prototype.hide = function () {
            visible = false;
            this.hideFunc();
        }

        AnnotationType.prototype.updateViewVisibility = function () {
            if (this.visible) this.show();
            else this.hide();
        }

        return AnnotationType; //constructor

    }).factory('annotator', function ($state) {

        //https://github.com/openannotation/annotator/tree/v1.2.x

        var addButtonIsShowing = false;
        var editorIsShowing = false;
        var annotator = null;

        function loadAnnotations() {

            var stateName = $state.current.name;

            annotator = $('#bookView').annotator();

            annotator.annotator("addPlugin", "Touch", {
                force: true
            });

            annotator.annotator("addPlugin", "Offline", {
                // Fires whenever annotations are made/edited
                setAnnotationData: function (ann) {
                    if (!ann.stateName) {
                        ann.stateName = stateName; // Use the state as the unique identifier for each page, to signify which page these annotations belong to.
                    }
                },
                // For each annotation, loads the annotation if returns true
                shouldLoadAnnotation: function (ann) {
                    return $state.current.name == ann.stateName;
                }
            });

        }

        function showAdder() {}

        function setShowAdderFunction(showAdder) {
            this.showAdder = showAdder;
        }

        return {
            loadAnnotations: loadAnnotations,
            setShowAdderFunction: setShowAdderFunction,
        }

    })
    .service('directiveCounter', function () {
        var dc = this;
        dc.counts = {};

        this.getAndIncrement = function (uniqueCountName) {

            if (!dc.counts[uniqueCountName])
                dc.counts[uniqueCountName] = 1;

            var ret = dc.counts[uniqueCountName];
            dc.counts[uniqueCountName] = dc.counts[uniqueCountName] + 1;

            return ret;
        };
    })
    .service('voicePlayer', function (screenPosition, $window, DEVICE) {

        var voicePlayer = this;

        var popcornPlayer = Popcorn("#voice");
        var audioElm;
        voicePlayer.isInitialized = false;

        voicePlayer.clear = function () {
            if (popcornPlayer)
                Popcorn.destroy(popcornPlayer);
            voicePlayer.isInitialized = false;
        }

        voicePlayer.init = function (words, callback) {

            console.log('Initializing Voice Player');

            if (popcornPlayer)
                Popcorn.destroy(popcornPlayer);

            popcornPlayer = Popcorn("#voice");
            readyPopcornForSeeking(popcornPlayer, function () {

                console.log('should be in callback');


                audioElm = document.getElementById('voice');
                var highlightBar = $('#readerHighlightOverlay');
                highlightBar.height(words[0]).height(); // set height to word's height.

                //            console.log('starting words.each()');

                words.each(function (index, word) {
                    var startTime = $(word).attr('st');
                    var endTime = $(word).attr('et');
                    popcornPlayer.code({
                        start: startTime,
                        end: endTime,
                        element: word,
                        onStart: partial(wordOnStart, highlightBar, word, voicePlayer),
                        onEnd: partial(wordOnEnd, word),
                    });
                });

                voicePlayer.isInitialized = true;

                callback();

            });

        }

        var wordOnStart = function (highlightBar, word, voicePlayer) {
            //console.log('wordOnStart()');
            if (voicePlayer.isInitialized) { // Work-around for issue where this function will run during initialization in some books (e.g. books 3 and 12).
                console.log('initialized. running word logic');
                $(highlightBar).offset({
                    top: $(word).offset().top,
                });
                screenPosition.centerScreenOn(word);
                $(word).addClass("active");
            }
        }

        var wordOnEnd = function (highlightBar, word) {
            $(word).removeClass("active");
        }

        voicePlayer.paused = function () {
            return popcornPlayer.paused();
        }

        function readyPopcornForSeeking(pop, callback) {
            console.log('readyPopcornForSeeking');
            //Force load of the media file. Then immediately pause. Not sure why we can't seek without jumping through these hoops.
            pop.cue(.01, function () {
                console.log('duration in init: ' + pop.duration());
                pop.pause();
                pop.removeTrackEvent(pop.getLastTrackEventId()); // clean up
                console.log('firing callback');
                callback();
            });
            pop.play();
        }

        function partial(func /*, 0..n args */ ) {
            // Allows us to pass function to popcorn player without running the logic.
            //Explanation: http://stackoverflow.com/questions/373157/how-can-i-pass-a-reference-to-a-function-with-parameters
            var args = Array.prototype.slice.call(arguments).splice(1);
            return function () {
                var allArguments = args.concat(Array.prototype.slice.call(arguments));
                return func.apply(this, allArguments);
            };
        }

        voicePlayer.play = function () {

            var startWord = $(getFirstReadableParOnScreen()).find("w").first();
            var startTime = Number(startWord.attr('st'));

            if (!voicePlayer.isInitialized)
                voicePlayer.init($("w"), function () {
                    console.log('initialized. beginning playback');
                    console.log('duration: ' + popcornPlayer.duration());
                    popcornPlayer.play(startTime);
                });
            else {
                popcornPlayer.play(startTime);
            }

        }

        function getFirstReadableParOnScreen() {
            var firstPar;
            $('p').each(function (i, p) {
                // Return first par on screen with w element
                if (p.getBoundingClientRect().top >= 0 && $(p).find("w").length) {
                    firstPar = p;
                    return false; // break loop
                }
            });
            return firstPar;
        }

        this.pause = function () {
            popcornPlayer.pause();
        }

        this.toggle = function () {
            if (popcornPlayer.paused())
                voicePlayer.play();
            else
                voicePlayer.pause();

        }

    });