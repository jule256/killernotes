/* globals define:true, console:true, document:true */
define(
    [
        'jQuery',
        'config',
        'auxiliary'
    ], function($, config, auxiliary) {

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

            $(document).off('kn:create', privateStoreNote);
            $(document).on('kn:create', privateStoreNote);

            $(document).off('kn:reset', privateResetNotes);
            $(document).on('kn:reset', privateResetNotes);

            $(document).off('kn:edit:save', privateStoreNote);
            $(document).on('kn:edit:save', privateStoreNote);

            $(document).off('kn:edit:delete', privateDeleteNote);
            $(document).on('kn:edit:delete', privateDeleteNote);
        };

        /**
         * Sets the engine to work with (server, local, ...)
         *
         * @author Dominik Süsstrunk <dominik.suesstrunk@gmail.com>
         * @param {object} engineRef
         */
        var publicSetEngine = function(engineRef) {
            engine = engineRef;
        };

        /**
         * Get notes promise from the storage engine
         *
         * @author Dominik Süsstrunk <dominik.suesstrunk@gmail.com>
         * @returns {*}
         */
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

            var promise = fn.apply(null);
            promise.done(function(responseData) {
                // auxiliary.logMessage(config.logLevels.info, false, 'engine.getList() DONE');
                deferred.resolve(responseData);
            });

            return deferred.promise();
        };

        /**
         * Get state promise from storage engine
         *
         * @author Dominik Süsstrunk <dominik.suesstrunk@gmail.com>
         * @returns {*}
         */
        var publicGetState = function() {
            var fn,
                deferred = $.Deferred();

            if (!privateCheckEngine()) {
                return;
            }

            fn = engine.getState;
            if (!privateEngineHasFunction(fn, 'getState')) {
                return;
            }

            var promise = fn.apply(null);
            promise.done(function(responseData) {
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
            promise.done(function() {
                auxiliary.logMessage(config.logLevels.success, true, 'Note deleted');

                privateTriggerDataUpdate(null, null);
            });
            promise.fail(function(responseData) {
                auxiliary.logMessage(config.logLevels.error, true, 'Note not deleted!');
                auxiliary.logMessage(config.logLevels.error, false, responseData);
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
                    promise = fn.apply(null, [ data, ev.kn.id ]);
                }
            }

            // show message
            promise.done(function() {
                auxiliary.logMessage(config.logLevels.success, true, 'note \'' + data.title + '\' saved');

                privateTriggerDataUpdate(data, ev.kn.id);
            });
            promise.fail(function(responseData) {
                auxiliary.logMessage(config.logLevels.error, true, 'note \'' + data.title + '\' not saved!');
                auxiliary.logMessage(config.logLevels.error, false, responseData);
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

            auxiliary.logMessage(config.logLevels.info, true, 'All notes removed');

            // show message
            promise.done(function() {
                auxiliary.logMessage(config.logLevels.success, true, 'All notes removed');

                privateTriggerDataUpdate(null, null);
            });
            promise.fail(function(responseData) {
                auxiliary.logMessage(config.logLevels.error, true, 'Reset failed!');
                auxiliary.logMessage(config.logLevels.error, false, responseData);
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

        /**
         * Checks if the engine contains a specific function
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {function} fn
         * @param {string} functionName
         * @returns {boolean}
         * @private
         */
        var privateEngineHasFunction = function(fn, functionName) {
            if (typeof fn === 'undefined' || typeof fn !== 'function') {
                throw Error('engine \'' + engine.toString() + '\' has no implementation of ' + functionName + '()');
            }
            return true;
        };

        var privateCheckEngine = function() {
            if (engine === null || typeof engine === 'undefined') {
                auxiliary.logMessage(config.logLevels.error, true, 'no storage engine specified');
                return false;
            }
            return true;
        };

        return {
            constructor: publicConstructor,
            setEngine: publicSetEngine,
            getNotes: publicGetNotes,
            getState: publicGetState
        };
    };
});