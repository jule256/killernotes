/* globals define:true, console:true */
define(
    [
        'jQuery',
        'handlebars',
        'config',
        'auxiliary'
    ], function ($, handlebars, config, auxiliary) {

    'use strict';

    // module
    var returnedView = function () {

        // configuration

        var sorting = config.defaultSort;
        var showFinished = config.defaultShowFinished;

        // handlebar settings

        var handlebarRegionId = 'region-view';
        var handlebarTemplateId = 'template-view';
        var handlebarPartialTemplateId = 'template-partial-note'
        var handlebarSource = null;
        var handlebarTemplate = null;
        var handlebarContext = null;
        var handleBarHtml = null;

        // private functions
        var retrieveNotes,
            getNoteElements,
            compareNotes,
            updateSort,
            updateFilter,
            handlebarsTimestampToDateHelper;

        var pad2Digits;

        this.constructor = function () {
            handlebars.registerPartial('note', $('#' + handlebarPartialTemplateId).html());
            handlebars.registerHelper('timestampToDate', handlebarsTimestampToDateHelper);

            $(document).bind('kn:sort', updateSort.bind(this)); // binding context "this" to updateSort()
            $(document).bind('kn:filter', updateFilter.bind(this)); // binding context "this" to updateFilter()
            $(document).bind('kn:created', this.render.bind(this)); // binding context "this" to render()
            $(document).bind('kn:reset:complete', this.render.bind(this)); // binding context "this" to render()
        };

        this.preRender = function () {
            handlebarSource = $('#' + handlebarTemplateId).html();
            handlebarTemplate = handlebars.compile(handlebarSource);
            handlebarContext = {
                title: 'view',
                noteElements: getNoteElements()
            };
            handleBarHtml = handlebarTemplate(handlebarContext);
        };

        this.render = function () {
            this.preRender();

            $('#' + handlebarRegionId).html(handleBarHtml);

            this.postRender();
        };

        this.postRender = function () {
            var noteElements = retrieveNotes();

            // add edit click functionality
            $.each(noteElements, function (key, value) {
                $('#note-' + key + ' .edit').on('click', function (ev) {
                    $.event.trigger({
                        type: 'kn:edit',
                        kn: {
                            id: key,
                            data: value
                        },
                        time: new Date()
                    });
                });
            });

            // inform other modules that view rendering is complete
            $.event.trigger({
                type: 'kn:view:complete',
                kn: {
                    sort: sorting
                },
                time: new Date()
            });
        };

        // private functions

        getNoteElements = function () {
            var noteElements = retrieveNotes(),
                cleanedElements = [],
                date;

            // parse createdate to a more human readable format
            $.each(noteElements, function (key, value) {
                date = new Date(value.createdate);
                if(!value.finished || showFinished) {
                    cleanedElements.push({
                        title: value.title || '<kein Titel>',
                        note: value.note || '<keine Notiz>', // @todo new-line-to-break
                        createdate: value.createdate, // date.toDateString(),
                        duedate: value.duedate,
                        importance: value.importance,
                        finished: value.finished
                    });
                }
            });

            // sort objects in array by current active sorting
            cleanedElements.sort(compareNotes);

            return cleanedElements;
        };

        compareNotes = function (note1, note2) {
            switch(sorting) {
                case 'importance':
                    return note2.importance - note1.importance;
                case 'createdate':
                    return note2.createdate - note1.createdate;
                case 'duedate':
                    return note2.duedate - note1.duedate;
                default:
                    console.error('"' + sorting + '" is not a valid sorting machanism');
                    return 0;
            }
        };

        updateSort = function(ev) {
            sorting = ev.kn.sort.name;
            this.render();
        };

        updateFilter = function(ev) {
            showFinished = ev.kn.filter;
            this.render();
        }

        retrieveNotes = function() {
            return JSON.parse(localStorage.getItem(config.localStorageName)) || {};
        };

        handlebarsTimestampToDateHelper = function(timestamp) {
            var dateObj = new Date(timestamp);
            return '' +
                auxiliary.pad2Digits(dateObj.getDay()) + '/' +
                auxiliary.pad2Digits(dateObj.getMonth()) + '/' +
                dateObj.getFullYear() + ' ' +
                auxiliary.pad2Digits(dateObj.getHours()) + ':' + auxiliary.pad2Digits(dateObj.getMinutes());
        };
    };

    return returnedView;

});