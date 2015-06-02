/* globals define:true, console:true */
define(
    [
        'jQuery',
        'handlebars',
        'config'
    ], function ($, handlebars, config) {

    'use strict';

    // module
    var returnedStorage = function () {

        // configuration

        // private functions
        var storeNote,
            resetNotes;

        this.constructor = function() {
            if (typeof(Storage) === 'undefined') {
                throw Error('local storage not supported, this app will not run in your browser');
            }

            $(document).bind('kn:create', storeNote);
            $(document).bind('kn:reset', resetNotes);
        };

        // private functions
        storeNote = function(ev) {
            var existingData,
                key = Date.now(),
                newData = ev.kn.data;

            // retrieve existing data
            existingData = JSON.parse(localStorage.getItem(config.localStorageName)) || {};

            // enhance new data with create date
            newData.createdate = key;

            // append new data to existing data
            existingData[key] = ev.kn.data;

            // store merged data
            localStorage.setItem(config.localStorageName, JSON.stringify(existingData));

            // trigger event so other modules can react
            $.event.trigger({
                type: 'kn:created',
                kn: {
                    key: key,
                    data: ev.kn.data
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
    };

    return returnedStorage;

});