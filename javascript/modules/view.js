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
        var editActive = false;

        // handlebar settings

        var handlebarRegionId = 'region-view';
        var handlebarTemplateId = 'template-view';
        var handlebarPartialTemplateId = 'template-partial-note';
        var handlebarSource = null;
        var handlebarTemplate = null;
        var handlebarContext = null;
        var handleBarHtml = null;

        /**
         * constructor
         *
         * @author Julian Mollik <jule@creative-coding.net>
         */
        var publicConstructor = function () {
            handlebars.registerPartial('note', $('#' + handlebarPartialTemplateId).html());
            handlebars.registerHelper('timestampToDate', privateHandlebarsTimestampToDateHelper);

            handlebarSource = $('#' + handlebarTemplateId).html();
            handlebarTemplate = handlebars.compile(handlebarSource);

            $(document).bind('kn:sort', privateUpdateSort);
            $(document).bind('kn:data:change', publicRender);
            $(document).bind('kn:reset:complete', publicRender);
            $(document).bind('kn:edit:cancel', publicRender);
            $(document).bind('kn:filter', privateUpdateFilter);
        };

        /**
         * appends the created html into the designated region of the DOM
         *
         * @author Julian Mollik <jule@creative-coding.net>
         */
        var publicRender = function () {
            privatePreRender();

            $('#' + handlebarRegionId).html(handleBarHtml);

            privatePostRender();
        };

        // private functions

        /**
         * automatically called before the html is appended into the DOM.
         * prepares the handlebar templating (setting context, creating the html)
         *
         * @author Julian Mollik <jule@creative-coding.net>
         */
        var privatePreRender = function () {
            handlebarContext = {
                title: 'view',
                noteElements: privateGetNoteElements()
            };
            handleBarHtml = handlebarTemplate(handlebarContext);
        };

        /**
         * automatically called after the html is appended into the DOM.
         * sets listeners and triggers
         *
         * @author Julian Mollik <jule@creative-coding.net>
         */
        var privatePostRender = function () {
            var noteElements = privateRetrieveNotes();

            // add edit click functionality
            $.each(noteElements, function (key, value) {
                $('#note-' + key + ' .edit').on('click', function () {
                    if (!editActive) {
                        // only trigger event if there is no other edit-process in progress
                        $.event.trigger({
                            type: 'kn:edit',
                            kn: {
                                id: key,
                                data: value
                            },
                            time: new Date()
                        });
                    }
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

            $(document).bind('kn:edit', privateDisableEdit);
            $(document).bind('kn:edit:cancel', privateEnableEdit);
            $(document).bind('kn:edit:save', privateEnableEdit);
        };

        /**
         * prepares the note-data so it can be used by the handlebars context
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @returns {Array}
         */
        var privateGetNoteElements = function () {
            var noteElements = privateRetrieveNotes(),
                cleanedElements = [],
                date;

            // parse createdate to a more human readable format
            $.each(noteElements, function (key, value) {
                date = new Date(value.createdate);

                if(!value.finished || showFinished) {
                    cleanedElements.push({
                        title: value.title || '<no title>',
                        note: value.note || '<no content>', // @todo new-line-to-break
                        createdate: value.createdate,
                        duedate: value.duedate,
                        importance: value.importance,
                        finished: value.finished
                    });
                }
            });

            // sort objects in array by current active sorting
            cleanedElements.sort(privateCompareNotes);

            return cleanedElements;
        };

        /**
         * compares the given two note objects by the currently active sorting. Usable by the Array.sort() function
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {object} note1
         * @param {object} note2
         * @returns {number}
         */
        var privateCompareNotes = function (note1, note2) {
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

        var privateUpdateSort = function(ev) {
            sorting = ev.kn.sort.name;

            publicRender();
        };

        var privateUpdateFilter = function(ev) {
            showFinished = ev.kn.filter;
            publicRender();
        };

        /**
         * gets the notes from localStorage and returns them as JSON-object
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @returns {object}
         */
        var privateRetrieveNotes = function() {
            return JSON.parse(localStorage.getItem(config.localStorageName)) || {};
        };

        var privateDisableEdit = function(ev) {
            editActive = true;

            // add "inactive" class to all other edit-note links
            $('.note').not('#note-' + ev.kn.id).find('.edit').addClass('inactive');
        };

        var privateEnableEdit = function(ev) {
            editActive = false;

            // remove "inactive" class of all edit links
            // note: since the view gets re-rendered on cancel AND on save, the following line is actually not needed
            $('.note').find('.edit').removeClass('inactive');
        };

        /**
         * takes the given timestamp and returns a string "dd/mm/yyyy hh:MM". Takes care of various shortcomings of
         * the native javascript Date object (like padding zeros and month values 0-11).
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {Number} timestamp
         * @returns {string}
         */
        var privateHandlebarsTimestampToDateHelper = function(timestamp) {
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