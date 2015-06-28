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

        /**
         * constructor
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @constructor
         */
        var publicConstructor = function() {

        };

        var publicGetList = function() {

            // auxiliary.logMessage(config.logLevels.info, false, 'serverstorage.js publicGetList()');

            return $.ajax({
                url: '/notes',
                method: 'GET',
                contentType: 'application/json'
            });
        };

        var publicCreate = function(data) {

            // auxiliary.logMessage(config.logLevels.info, false, 'serverstorage.js publicCreate()', data);

            return $.ajax({
                url: '/notes',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(data)
            });
        };

        var publicUpdate = function(data, key) {

            // auxiliary.logMessage(config.logLevels.info, false, 'serverstorage.js publicUpdate()', data, key);

            // enhance data with create date
            data.createdate = +key; // make sure 'key' is number

            return $.ajax({
                url: '/notes/' + key,
                method: 'PUT',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(data)
            });
        };

        var publicDelete = function(key) {

            // auxiliary.logMessage(config.logLevels.info, false, 'serverstorage.js publicDelete()', key);

            return $.ajax({
                url: '/notes/' + key,
                method: 'DELETE',
                contentType: 'application/json',
                dataType: 'json'
            });
        };

        var publicDeleteAll = function() {

            // auxiliary.logMessage(config.logLevels.info, false, 'serverstorage.js publicDeleteAll()');

            return $.ajax({
                url: '/notes',
                method: 'DELETE',
                contentType: 'application/json',
                dataType: 'json'
            });
        };

        var publicToString = function() {
            return 'serverstorage';
        };

        /**
         * Get current state of all notes
         *
         * @returns {promise}
         */
        var publicGetState = function() {
            return $.ajax({
                url: '/notes/state',
                method: 'GET',
                dataType: 'json'
            });
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