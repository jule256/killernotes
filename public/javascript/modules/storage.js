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
            else {
                // @todo feedback with promises

                // console.log('calling getList() of engine', engine.toString());

                fn('param').done(function(jsonData) {
                    console.log('engine.getList() DONE: ', jsonData);
                    deferred.resolve(jsonData);
                });

                // var returnValue = fn.apply(null, []);

                // console.log('returnValue', returnValue);

//              return {}; // returnValue;
                return deferred.promise();
            }
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
            var data = ev.kn.data,
                key = ev.kn.id,
                fn;

            if (!privateCheckEngine()) {
                return;
            }

            fn = engine.delete;
            if (!privateEngineHasFunction(fn, 'delete')) {
                return;
            }
            else {
                // @todo feedback with promises
                fn.apply(null, [ data, key ]);
            }

            // log success message
            auxiliary.logMessage(config.logLevels.success, 'Note ' + key + ' deleted', true);

            // trigger event so other modules can react
            privateTriggerDataUpdate(); // key, {}
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
                fn;

            if (!privateCheckEngine()) {
                return;
            }

            if (newNote) {
                fn = engine.create;
                if (!privateEngineHasFunction(fn, 'create')) {
                    return;
                }
                else {
                    // @todo feedback with promises
                    fn.apply(null, [ data, 'param2' ]);
                }
            }
            else {
                fn = engine.update;
                if (!privateEngineHasFunction(fn, 'update')) {
                    return;
                }
                else {
                    fn.apply(null, [ data, ev.kn.id ]);
                }
            }

            // show message
            auxiliary.logMessage(config.logLevels.success, 'note \'' + data.title + '\' saved', true);

            // trigger event so other modules can react
            privateTriggerDataUpdate(); // key, data
        };

        /**
         * resets (removes) all notes from the storage
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @private
         */
        var privateResetNotes = function() {
            var fn;

            if (!privateCheckEngine()) {
                return;
            }

            fn = engine.deleteAll;
            if (!privateEngineHasFunction(fn, 'deleteAll')) {
                return;
            }
            else {
                // @todo feedback with promises
                fn.apply(null, [] );
            }

            auxiliary.logMessage(config.logLevels.info, 'All notes removed', true);

            privateTriggerDataUpdate(); // 0, {}
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