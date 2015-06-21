/* globals define:true, console:true, document:true */
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

        // class variables
        var engine = null;

        /**
         * constructor
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @constructor
         */
        var publicConstructor = function() {
            if (typeof(Storage) === 'undefined') {
                throw Error('local storage not supported, this app will not run in your browser');
            }

            $(document).on('kn:create', privateStoreNote);
            $(document).on('kn:reset', privateResetNotes);
            $(document).on('kn:edit:save', privateStoreNote);
            $(document).on('kn:edit:delete', privateDeleteNote);
        };

        var publicSetEngine = function(engineRef) {
            engine = engineRef;
        };

        var publicGetNotes = function() {
            var fn,
                deferred = $.Deferred();

            if (!privateCheckEngine()) {
                return;
            }

            fn = engine.getList;
            if (!privateEngineHasFunction(fn, 'getList')) {
                return;
            }

            var promise = fn('param');
            promise.done(function(responseData) {
                auxiliary.logMessage(config.logLevels.info, 'engine.getList() DONE');
                deferred.resolve(responseData);
            });

            return deferred.promise();
        };

        // private functions

        /**
         * Delete note with given id  the note with that id will be deleted
         *
         * @author Dominik Süsstrunk <dominik.suesstrunk@gmail.com>
         * @param {object} ev
         * @private
         */
        var privateDeleteNote = function(ev) {
           var key = ev.kn.id,
               fn,
               promise;

            if (!privateCheckEngine()) {
                return;
            }

            fn = engine.delete;
            if (!privateEngineHasFunction(fn, 'delete')) {
                return;
            }
            else {
                promise = fn.apply(null, [ key ]);
            }

            // show message
            promise.done(function(responseData) {
                auxiliary.logMessage(config.logLevels.success, 'Note deleted', true);

                privateTriggerDataUpdate(null, null);
            });
            promise.fail(function(responseData) {
                auxiliary.logMessage(config.logLevels.error, 'Note not deleted!', true);
                auxiliary.logMessage(config.logLevels.error, data, false);
            });
        };

        /**
         * stores the note with data from ev.kn.data, if ev.kn.id is set, the note with that id will be updated
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {object} ev
         * @private
         */
        var privateStoreNote = function(ev) {

            var newNote = typeof ev.kn.id === 'undefined',
                data = ev.kn.data,
                fn,
                promise;

            if (!privateCheckEngine()) {
                return;
            }

            if (newNote) {
                fn = engine.create;
                if (!privateEngineHasFunction(fn, 'create')) {
                    return;
                }
                else {
                    promise = fn.apply(null, [ data ]);
                }
            }
            else {
                fn = engine.update;
                if (!privateEngineHasFunction(fn, 'update')) {
                    return;
                }
                else {
                    promise = fn.apply(null, [data, ev.kn.id]);
                }
            }

            // show message
            promise.done(function(responseData) {
                auxiliary.logMessage(config.logLevels.success, 'note \'' + data.title + '\' saved', true);

                privateTriggerDataUpdate(data, ev.kn.id);
            });
            promise.fail(function(responseData) {
                auxiliary.logMessage(config.logLevels.error, 'note \'' + data.title + '\' not saved!', true);
                auxiliary.logMessage(config.logLevels.error, data, false);
            });

        };

        /**
         * resets (removes) all notes from the storage
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @private
         */
        var privateResetNotes = function() {
            var fn,
                promise;

            if (!privateCheckEngine()) {
                return;
            }

            fn = engine.deleteAll;
            if (!privateEngineHasFunction(fn, 'deleteAll')) {
                return;
            }
            else {
                // @todo feedback with promises
                promise = fn.apply(null);
            }

            auxiliary.logMessage(config.logLevels.info, 'All notes removed', true);

            // show message
            promise.done(function(responseData) {
                auxiliary.logMessage(config.logLevels.success, 'All notes removed', true);

                privateTriggerDataUpdate(null, null);
            });
            promise.fail(function(responseData) {
                auxiliary.logMessage(config.logLevels.error, 'Reset failed!', true);
                auxiliary.logMessage(config.logLevels.error, data, false);
            });
        };

        /**
         * Triggers kn:data:change event
         *
         * @author Dominik Süsstrunk <dominik.suesstrunk@gmail.com>
         * @param {number} key
         * @param {object} data
         * @private
         */
        var privateTriggerDataUpdate = function(key, data) {
            $.event.trigger({
                type: 'kn:data:change',
                kn: {
                    key: key,
                    data: data
                }
            });
        };

        var privateEngineHasFunction = function(fn, functionName) {
            if (typeof fn === 'undefined' || typeof fn !== 'function') {
                throw Error('engine \'' + engine.toString() + '\' has no implementation of ' + functionName + '()');
            }
            return true;
        };

        var privateCheckEngine = function() {
            if (engine === null || typeof engine === 'undefined') {
                auxiliary.logMessage(config.logLevels.error, 'no storage engine specified', true);
                return false;
            }
            return true;
        };

        return {
            constructor: publicConstructor,
            setEngine: publicSetEngine,
            getNotes: publicGetNotes
        };
    };
});