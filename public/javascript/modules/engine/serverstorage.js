/* globals define:true, console:true */
define(
    [
        'jQuery'
    ], function($) {

    'use strict';

    // module
    /**
     * a storage-egine for killernotes has to implement the following functions
     *     - getList()   -> return all notes
     *     - create()    -> create new note
     *     - update()    -> update an existing note by id
     *     - delete()    -> delete an existing note by id
     *     - deleteAll() -> delete all existing notes
     *     - getState()  -> gets the state-hash of all notes (necessary for polling)
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

        /**
         * Get all notes from the storage
         *
         * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
         * @returns {Promise}
         */
        var publicGetList = function() {
            return $.ajax({
                url: '/notes',
                method: 'GET',
                contentType: 'application/json'
            });
        };

        /***
         *
         * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
         * @param {Object} data
         * @returns {Promise}
         */
        var publicCreate = function(data) {
            return $.ajax({
                url: '/notes',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(data)
            });
        };

        /**
         * Update a note in the storage
         *
         * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
         * @param {Object} data
         * @param {Number} key
         * @returns {Promise}
         */
        var publicUpdate = function(data, key) {
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

        /**
         * Delete a single item from the storage
         *
         * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
         * @param {number} key
         * @returns {Promise}
         */
        var publicDelete = function(key) {
            return $.ajax({
                url: '/notes/' + key,
                method: 'DELETE',
                contentType: 'application/json',
                dataType: 'json'
            });
        };

        /**
         * Delete all notes in the storage
         *
         * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
         * @returns {Promise}
         */
        var publicDeleteAll = function() {
            return $.ajax({
                url: '/notes',
                method: 'DELETE',
                contentType: 'application/json',
                dataType: 'json'
            });
        };

        /**
         * ToString method
         *
         * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
         * @returns {string}
         */
        var publicToString = function() {
            return 'serverstorage';
        };

        /**
         * Get current state of all notes
         *
         * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
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