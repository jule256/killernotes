/* globals define:true, console:true */
define(
    [
        'jQuery',
        'handlebars',
        'config'
    ], function ($, handlebars, config) {

    'use strict';

    // module
   return function () {

        // configuration

        // private functions
        var storeNote,
            resetNotes,
            getExistingData;

        var publicConstructor = function() {
            if (typeof(Storage) === 'undefined') {
                throw Error('local storage not supported, this app will not run in your browser');
            }

            $(document).bind('kn:create', storeNote);
            $(document).bind('kn:reset', resetNotes);
            $(document).bind('kn:edit:save', storeNote);
        };

        // private functions

        /**
         * stores the note with data from ev.kn.data, if ev.kn.id is set, the note with that id will be updated
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {object} ev
         */
        storeNote = function(ev) {
            var existingData,
                newNote = typeof ev.kn.id === 'undefined',
                key = newNote ? Date.now() : ev.kn.id,
                data = ev.kn.data;

            // retrieve existing data
            existingData = getExistingData();

            // enhance data with create date
            // since the key is the created date, we can set the createdate to the key, regardless if edit or new mode
            data.createdate = +key; // make sure 'key' is number

            // append (if new) or replace (if edit) data to existing data
            existingData[key] = data;

            // store merged data
            localStorage.setItem(config.localStorageName, JSON.stringify(existingData));

            // trigger event so other modules can react
            $.event.trigger({
                type: 'kn:data:change',
                kn: {
                    key: key,
                    data: data
                },
                time: new Date()
            });
        };

        resetNotes = function() {
            localStorage.removeItem(config.localStorageName);

            // trigger event so other modules can react
            $.event.trigger({
                type: 'kn:reset:complete',
                kn: {},
                time: new Date()
            });
        };
        
        /**
         * reads the local storage and returns its data as object (empty if not found)
         * @author Julian Mollik <jule@creative-coding.net>
         * @returns {object}
         */
        getExistingData = function() {
            return JSON.parse(localStorage.getItem(config.localStorageName)) || {};
        };

       return {
           constructor: publicConstructor
       };
    };
});