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
                jsonData;

            console.log('localstorage.js publicGetList()', param);

            jsonData = JSON.parse(localStorage.getItem(localStorageName)) || {};

            deferred.resolve(jsonData);

            return deferred.promise();
        };

        var publicCreate = function(data) {
            var existingData = privateGetExistingData(),
                key = Date.now();

            console.log('localstorage.js publicCreate()', data);

            // enhance data with create date
            data.createdate = +key; // make sure 'key' is number

            // append data to existing data
            existingData[key] = data;

            // store merged data
            localStorage.setItem(localStorageName, JSON.stringify(existingData));

            // @todo return promise
        };

        var publicUpdate = function(data, key) {
            var existingData = privateGetExistingData();

            console.log('localstorage.js publicUpdate()', data, key);

            // enhance data with create date
            data.createdate = +key; // make sure 'key' is number

            // replace data in existing data
            existingData[key] = data;

            // store merged data
            localStorage.setItem(localStorageName, JSON.stringify(existingData));

            // @todo return promise
        };

        var publicDelete = function(data, key) {
            var existingData = privateGetExistingData();

            console.log('localstorage.js publicDelete()', data, key);

            // remove item from existsing data
            delete existingData[+key];

            // store merged data
            localStorage.setItem(localStorageName, JSON.stringify(existingData));
        };

        var publicDeleteAll = function(data, key) {
            localStorage.removeItem(localStorageName);
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
            toString: publicToString
        };
    };
});