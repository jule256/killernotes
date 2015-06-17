/* globals define:true, console:true, document:true, localStorage:true */
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

            // private functions
            var privateStoreNote,
                privateDeleteNote,
                privateResetNotes,
                privateGetExistingData,
                privateTriggerDataUpdate;

            var publicConstructor = function() {
                if (typeof(Storage) === 'undefined') {
                    throw Error('local storage not supported, this app will not run in your browser');
                }

                $(document).bind('kn:create', privateStoreNote);
                $(document).bind('kn:reset', privateResetNotes);
                $(document).bind('kn:edit:save', privateStoreNote);
                $(document).bind('kn:edit:delete', privateDeleteNote);
            };

            /**
             * Delete note with given id  the note with that id will be deleted
             *
             * @author Dominik Süsstrunk <dominik.suesstrunk@gmail.com>
             * @param {object} ev
             * @private
             */
            privateDeleteNote = function(ev) {
                var key = ev.kn.id,
                    existingData = privateGetExistingData();

                // remove item from existsing data
                delete existingData[+key];

                // store merged data
                localStorage.setItem(config.localStorageName, JSON.stringify(existingData));

                // log success message
                auxiliary.logMessage(config.logLevels.success, 'Note ' + key + ' deleted', true);

                // trigger event so other modules can react
                privateTriggerDataUpdate(key, {});
            };

            /**
             * stores the note with data from ev.kn.data, if ev.kn.id is set, the note with that id will be updated
             *
             * @author Julian Mollik <jule@creative-coding.net>
             * @param {object} ev
             * @private
             */
            privateStoreNote = function(ev) {

                var existingData,
                    newNote = typeof ev.kn.id === 'undefined',
                    key = newNote ? Date.now() : ev.kn.id,
                    data = ev.kn.data;

                // retrieve existing data
                existingData = privateGetExistingData();

                // enhance data with create date
                // since the key is the created date, we can set the createdate to the key,
                // regardless if edit or new mode
                data.createdate = +key; // make sure 'key' is number

                // append (if new) or replace (if edit) data to existing data
                existingData[key] = data;

                // store merged data
                localStorage.setItem(config.localStorageName, JSON.stringify(existingData));

                // show message
                auxiliary.logMessage(config.logLevels.success, 'note \'' + data.title + '\' saved', true);

                // trigger event so other modules can react
                privateTriggerDataUpdate(key, data);
            };

            /**
             * resets (removes) all notes from the storage
             *
             * @author Julian Mollik <jule@creative-coding.net>
             * @private
             */
            privateResetNotes = function() {
                localStorage.removeItem(config.localStorageName);

                auxiliary.logMessage(config.logLevels.info, 'All notes removed', true);

                privateTriggerDataUpdate(0, {});
            };

            /**
             * Triggers kn:data:change event
             *
             * @author Dominik Süsstrunk <dominik.suesstrunk@gmail.com>
             * @param {number} key
             * @param {object} data
             * @private
             */
            privateTriggerDataUpdate = function(key, data) {
                $.event.trigger({
                    type: 'kn:data:change',
                    kn: {
                        key: key,
                        data: data
                    },
                    time: new Date()
                });
            };

            /**
             * reads the local storage and returns its data as object (empty if not found)
             * @author Julian Mollik <jule@creative-coding.net>
             * @returns {object}
             * @private
             */
            privateGetExistingData = function() {
                return JSON.parse(localStorage.getItem(config.localStorageName)) || {};
            };

            return {
                constructor: publicConstructor
            };
        };
    });