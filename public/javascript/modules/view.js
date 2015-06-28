/* globals define:true, console:true, document:true, killernotes:true */
define(
    [
        'jQuery',
        'handlebars',
        'config',
        'auxiliary'
    ], function($, handlebars, config, auxiliary) {

    'use strict';

    // module
    return function() {

        // configuration
        var sorting = config.defaultSort;
        var showFinished = config.defaultShowFinished;

        // class variables
        var editRef = null;
        var storageRef = null;
        var dataState = null;
        var $refreshButton = null;

        // handlebar settings
        var handlebarRegionId = 'region-view';
        var handlebarTemplate = null;
        var handlebarContext = null;

        /**
         * constructor
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @constructor
         */
        var publicConstructor = function() {
            handlebars.registerPartial('note', killernotes.templates.partial.note);
            handlebars.registerHelper('timestampToDate', privateHandlebarsTimestampToDateHelper);
            handlebars.registerHelper('times', auxiliary.handlebarsForLoop);
            handlebars.registerHelper('breakLines', auxiliary.handlebarsBreakLines);

            handlebarTemplate = killernotes.templates.view;

            $(document).on('kn:sort', privateUpdateSort);
            $(document).on('kn:data:change', publicRender);
            $(document).on('kn:reset:complete', publicRender);
            $(document).on('kn:edit:cancel', publicRender);
            $(document).on('kn:filter', privateUpdateFilter);
            $(document).on('kn:edit:validation:failed', privateShowError);

            $('body').on('click', '#notes-refresh', function() {
                // only perform if edit is not active
                if (!privateIsEditActive()) {
                    publicRender();
                    privateSetRefreshState(false);
                }
            });

            window.setTimeout(function() {
                privateGetState(true);
            }, config.dataRefreshIntervall);
        };

        /**
         * appends the created html into the designated region of the DOM
         *
         * @author Julian Mollik <jule@creative-coding.net>
         */
        var publicRender = function() {
            privatePreRender().done(function(handleBarHtml) {
                $('#' + handlebarRegionId).html(handleBarHtml);
                privatePostRender();
            });
        };

        /**
         * registeres the given editRefParam in this class to be able to query if for "is edit active"
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {object} editRefParam
         */
        var publicRegisterEdit = function(editRefParam) {
            editRef = editRefParam;
        };

        /**
         * registeres the given storageRefParam in this class to be able to retrieve notes
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {object} storageRefParam
         */
        var publicRegisterStorage = function(storageRefParam) {
            storageRef = storageRefParam;
        };

        // private functions

        /**
         * automatically called before the html is appended into the DOM.
         * prepares the handlebar templating (setting context, creating the html)
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @private
         */
        var privatePreRender = function() {
            var deferred = $.Deferred();

            privateGetNoteElements().done(function(cleanedElements) {
                var handleBarHtml;
                handlebarContext = {
                    title: 'view',
                    noteElements: cleanedElements
                };
                handleBarHtml = handlebarTemplate(handlebarContext);

                deferred.resolve(handleBarHtml);
            });

            return deferred.promise();
        };

        /**
         * automatically called after the html is appended into the DOM.
         * sets listeners and triggers
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @private
         */
        var privatePostRender = function() {

            $refreshButton = $('#notes-refresh');

            privateRetrieveNotes().done(function(noteElements) {
                // auxiliary.logMessage(config.logLevels.info, false, 'privateRetrieveNotes() DONE', noteElements);
                $.each(noteElements, function(key, value) {

                    // add change state functionality
                    $('#note-' + value.createdate + ' .kn-note-state').on('click', function() {
                        if (!privateIsEditActive()) {
                            // only trigger event if there is no other edit-process in progress
                            value.finished = !value.finished;
                            $.event.trigger({
                                type: 'kn:edit:save',

                                kn: {
                                    id: value.createdate,
                                    data: value
                                }
                            });
                        }
                    });

                    // add edit click functionality
                    $('#note-' + value.createdate + ' .kn-note-edit').on('click', function() {

                        if (!privateIsEditActive()) {
                            // only trigger event if there is no other edit-process in progress
                            $.event.trigger({
                                type: 'kn:edit',
                                kn: {
                                    id: value.createdate,
                                    data: value
                                }
                            });
                        }
                    });
                });

                // inform other modules that view rendering is complete
                $.event.trigger({
                    type: 'kn:view:complete',
                    kn: {
                        sort: sorting
                    }
                });

                console.log('adding document.on-listeners ...');

                $(document).on('kn:edit', privateDisableActions);
                $(document).on('kn:edit:cancel', privateEnableActions);
                $(document).on('kn:reset:complete', privateEnableActions);
                $(document).on('kn:edit:save', privateEnableActions);
                $(document).on('kn:edit:delete', privateEnableActions);

                privateGetState(false);
            });
        };

        /**
         * prepares the note-data so it can be used by the handlebars context
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @returns {Array}
         * @private
         */
        var privateGetNoteElements = function() {
            var deferred = $.Deferred();

            privateRetrieveNotes().done(function(noteElements) {
                var cleanedElements = [],
                    date;

                // parse createdate to a more human readable format
                $.each(noteElements, function(key, value) {
                    date = new Date(+value.createdate);

                    if (!value.finished || showFinished) {
                        cleanedElements.push({
                            title: value.title || '<no title>',
                            note: value.note || '<no content>',
                            createdate: +value.createdate,
                            duedate: value.duedate,
                            importance: value.importance,
                            finished: value.finished
                        });
                    }
                });

                // sort objects in array by current active sorting
                cleanedElements.sort(privateCompareNotes);

                deferred.resolve(cleanedElements);
            });

            return deferred.promise();
        };

        /**
         * compares the given two note objects by the currently active sorting. Usable by the Array.sort() function
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {object} note1
         * @param {object} note2
         * @returns {number}
         * @private
         */
        var privateCompareNotes = function(note1, note2) {
            switch (sorting) {
                case 'importance':
                    return note2.importance - note1.importance;
                case 'createdate':
                    return note2.createdate - note1.createdate;
                case 'duedate':
                    return note2.duedate - note1.duedate;
                default:
                    auxiliary.logMessage(config.logLevels.error, false, '"' + sorting + '" is not a valid ' +
                        'sorting machanism');
                    return 0;
            }
        };

        /**
         * Update which sorting algorithm should be used
         *
         * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
         * @param {object} ev
         * @private
         */
        var privateUpdateSort = function(ev) {
            sorting = ev.kn.sort.name;

            publicRender();
        };

        /**
         * Update wether the finished items should appear or not
         *
         * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
         * @param {object} ev
         * @private
         */
        var privateUpdateFilter = function(ev) {
            showFinished = ev.kn.filter;
            publicRender();
        };

        /**
         * visually disables all non affected edit-links by adding the css class 'disabled'
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {object} ev
         * @private
         */
        var privateDisableActions = function(ev) {
            var $note = $('.kn-note');

            // add "disabled" class to all other edit-note links
            $note.not('#note-' + ev.kn.id).find('.kn-note-edit').addClass('disabled');

            // add "disabled" class to all other finish-note links
            $note.not('#note-' + ev.kn.id).find('.kn-note-state').addClass('disabled');

            $refreshButton.addClass('disabled');
        };

        /**
         * Gets the notes from the storage
         *
         * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
         * @returns {promise}
         * @private
         */
        var privateRetrieveNotes = function() {
            var deferred = $.Deferred();

            if (storageRef === null) {
                throw Error ('storageRef is not set');
            }

            storageRef.getNotes().done(function(responseData) {
                // auxiliary.logMessage(config.logLevels.info, false, 'privateRetrieveNotes() DONE: ', responseData);
                deferred.resolve(responseData);
            });

            return deferred.promise();
        };

        /**
         * visually enables all all edit links by removing the class "disabled"
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @private
         */
        var privateEnableActions = function() {
            var $note = $('.kn-note');

            // remove "disabled" class of all edit-note links
            // note: since the view gets re-rendered on cancel AND on save, the following line is actually not needed
            $note.find('.kn-note-edit').removeClass('disabled');

            // remove "disabled" class to all finish-note links
            // note: since the view gets re-rendered on cancel AND on save, the following line is actually not needed
            $note.find('.kn-note-state').removeClass('disabled');

            $refreshButton.removeClass('disabled');
        };

        /**
         * takes the given timestamp and returns a string "dd/mm/yyyy hh:MM". Takes care of various shortcomings of
         * the native javascript Date object (like padding zeros and month values 0-11).
         *
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

        /**
         * checks if the editRef is set (should always be the case) and returns the result of editRef's isEditActive()
         * function
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @returns {boolean}
         * @private
         */
        var privateIsEditActive = function() {
            if (editRef === null) {
                throw Error ('editRef is not set');
            }
            return editRef.isEditActive();
        };

        /**
         * sets the highlighting class on the refresh button
         *
         * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
         * @param {boolean} hasNewData
         * @private
         */
        var privateSetRefreshState = function(hasNewData) {
            if (hasNewData) {
                $refreshButton.addClass('highlight');
            } else {
                $refreshButton.removeClass('highlight');
            }
        };

        /**
         * gets the state of the data from the storage
         *
         * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
         * @param {boolean} triggerUpdate
         * @private
         */
        var privateGetState = function(triggerUpdate) {
            if (storageRef === null) {
                throw Error('storageRef is not set');
            }

            var promise = storageRef.getState();

            promise.done(function(currentState) {

                if (triggerUpdate && dataState !== null && dataState !== currentState) {
                    privateSetRefreshState(true);
                    auxiliary.logMessage(config.logLevels.info, true, 'New data is available!');
                } else if (!triggerUpdate) {
                    privateSetRefreshState(false);
                }

                dataState = currentState;

                if (triggerUpdate) {
                    window.setTimeout(function() {
                        privateGetState(true);
                    }, config.dataRefreshIntervall);
                }
            });

            promise.fail(function(responseData) {
                auxiliary.logMessage(config.logLevels.error, false, 'Get state failed', responseData);
            });
        };

        /**
         * takes the error messages from the given ev.kn, adds them to the according error-div in the DOM and
         * visually displays the error
         *
         * @todo is duplicated code. Same code appears in privateShowError() of create.js
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {object} ev
         * @private
         */
        var privateShowError = function(ev) {
            var allMessages = ev.kn.messages,
                mode = ev.kn.mode,
                i,
                concatinatedMessage,
                $formField,
                $errorDiv;

            $.each(allMessages, function(key, messages) {
                $formField = $('#' + mode + '-' + key);
                $errorDiv = $('#' + mode + '-' + key + '-error');

                // add error class to form-field
                $formField.addClass('error');
                concatinatedMessage = [];
                for (i = 0; i < messages.length; i++) {
                    concatinatedMessage.push(messages[i]);
                }

                $errorDiv.removeClass('hide'); // @todo or fancy effect?
                $errorDiv.html(concatinatedMessage.join('<br />'));
            });
        };

        return {
            constructor: publicConstructor,
            render: publicRender,
            registerEdit: publicRegisterEdit,
            registerStorage: publicRegisterStorage
        };
    };
});