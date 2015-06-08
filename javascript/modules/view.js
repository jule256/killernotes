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
    return function () {

        // configuration
        var sorting = config.defaultSort;
        var showFinished = config.defaultShowFinished;

        // handlebar settings

        var handlebarRegionId = 'region-view';
        var handlebarTemplateId = 'template-view';
        var handlebarPartialTemplateId = 'template-partial-note';
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

        var publicConstructor = function () {
            handlebars.registerPartial('note', $('#' + handlebarPartialTemplateId).html());
            handlebars.registerHelper('timestampToDate', handlebarsTimestampToDateHelper);

            handlebarSource = $('#' + handlebarTemplateId).html();
            handlebarTemplate = handlebars.compile(handlebarSource);


            $(document).bind('kn:sort', updateSort); // binding context "this" to updateSort()
            $(document).bind('kn:data:change', publicRender); // binding context "this" to render()
            $(document).bind('kn:reset:complete', publicRender); // binding context "this" to render()
            $(document).bind('kn:edit:cancel', publicRender);
            $(document).bind('kn:filter', updateFilter);// binding context "this" to render()
        };

        var publicRender = function () {
            privatePreRender();

            $('#' + handlebarRegionId).html(handleBarHtml);

            privatePostRender();
        };

        var privatePreRender = function () {
            handlebarContext = {
                title: 'view',
                noteElements: getNoteElements()
            };
            handleBarHtml = handlebarTemplate(handlebarContext);
        };

        var privatePostRender = function () {
            var noteElements = retrieveNotes();

            // add edit click functionality
            $.each(noteElements, function (key, value) {
                $('#note-' + key + ' .edit').on('click', function () {
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

        getNoteElements = function () {
            var noteElements = retrieveNotes(),
                cleanedElements = [],
                date;

            // parse createdate to a more human readable format
            $.each(noteElements, function (key, value) {
                date = new Date(value.createdate);

                if(!value.finished || showFinished) {
                    cleanedElements.push({
                        title: value.title || '<no title>',
                        note: value.note || '<no content>', // @todo new-line-to-break
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

            publicRender();
        };

        updateFilter = function(ev) {

            showFinished = ev.kn.filter;
            publicRender();
        };

        retrieveNotes = function() {
            return JSON.parse(localStorage.getItem(config.localStorageName)) || {};
        };

        /**
         * takes the given timestamp and returns a string "dd/mm/yyyy hh:MM". Takes care of various shortcomings of
         * the native javascript Date object (like padding zeros and month values 0-11).
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {Number} timestamp
         * @returns {string}
         */
        handlebarsTimestampToDateHelper = function(timestamp) {
            var dateObj = new Date(timestamp);
            return '' +
                auxiliary.pad2Digits(dateObj.getDate()) + '/' +
                auxiliary.pad2Digits(dateObj.getMonth() + 1) + '/' +
                dateObj.getFullYear() + ' ' +
                auxiliary.pad2Digits(dateObj.getHours()) + ':' + auxiliary.pad2Digits(dateObj.getMinutes());
        };

        return {
            constructor: publicConstructor,
            render: publicRender
        };
    };
});