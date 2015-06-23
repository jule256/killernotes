/* globals define:true, console:true, document:true, localStorage:true */
define(
    [
        'jQuery',
        'config',
        'auxiliary'
    ], function($, config, auxiliary) {

    'use strict';

    // module
    /**
     * a storage-egine for killernotes has to implement the following functions
     *     - getList()   -> return all notes
     *     - create()    -> create new note
     *     - update()    -> update an existing note by id
     *     - delete()    -> delete an existing note by id
     *     - deleteAll() -> delete all existing notes
     *
     * @author Julian Mollik <jule@creative-coding.net>
     */
    return function() {

        // configuration
        var localStorageName = 'kn:storage';

        // class variables

        /**
         * constructor
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @constructor
         */
        var publicConstructor = function() {

        };

        var publicGetList = function(param) {

            var deferred = $.Deferred(),
                data;

            auxiliary.logMessage(config.logLevels.info, false, 'localstorage.js publicGetList()', param);

            data = JSON.parse(localStorage.getItem(localStorageName)) || {};

            deferred.resolve(data);

            return deferred.promise();
        };

        var publicCreate = function(data) {
            var existingData = privateGetExistingData(),
                key = Date.now(),
                deferred = $.Deferred();

            auxiliary.logMessage(config.logLevels.info, false, 'localstorage.js publicCreate()', data);

            // enhance data with create date
            data.createdate = +key; // make sure 'key' is number

            // append data to existing data
            existingData[key] = data;

            // store merged data
            localStorage.setItem(localStorageName, JSON.stringify(existingData));

            deferred.resolve(data);

            return deferred.promise();
        };

        var publicUpdate = function(data, key) {
            var existingData = privateGetExistingData(),
                deferred = $.Deferred();

            auxiliary.logMessage(config.logLevels.info, false, 'localstorage.js publicUpdate()', data, key);

            // enhance data with create date
            data.createdate = +key; // make sure 'key' is number

            // replace data in existing data
            existingData[key] = data;

            // store merged data
            localStorage.setItem(localStorageName, JSON.stringify(existingData));

            deferred.resolve(data);
            return deferred.promise();
        };

        var publicDelete = function(key) {
            var existingData = privateGetExistingData(),
                deferred = $.Deferred();

            auxiliary.logMessage(config.logLevels.info, false, 'localstorage.js publicDelete()', key);

            // remove item from existsing data
            delete existingData[+key];

            // store merged data
            localStorage.setItem(localStorageName, JSON.stringify(existingData));

            deferred.resolve(1);
            return deferred.promise();
        };

        var publicDeleteAll = function() {
            var deferred = $.Deferred();

            localStorage.removeItem(localStorageName);

            deferred.resolve();
            return deferred.promise();
        };

        /**
         * Get current state of all notes
         *
         * @returns {promise}
         */
        var publicGetState = function() {
            var deferred = $.Deferred();

            var result = localStorage.getItem(localStorageName);

            deferred.resolve(result);
            return deferred.promise();
        };

        var publicToString = function() {
            return '"localStorage" (store-name: ' + localStorageName + ')';
        };

        /**
         * reads the local storage and returns its data as object (empty if not found)
         * @author Julian Mollik <jule@creative-coding.net>
         * @returns {object}
         * @private
         */
        var privateGetExistingData = function() {
            return JSON.parse(localStorage.getItem(localStorageName)) || {};
        };

        return {
            constructor: publicConstructor,
            getList: publicGetList,
            create: publicCreate,
            update: publicUpdate,
            delete: publicDelete,
            deleteAll: publicDeleteAll,
            getState: publicGetState,
            toString: publicToString
        };
    };
});