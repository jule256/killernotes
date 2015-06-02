/* global define:true, console:true */
define(
    [
        'jQuery',
        'modules/sort',
        'modules/create',
        'modules/storage',
        'modules/view',
        'modules/reset',
        'modules/edit'
    ], function ($, SortRef, CreateRef, StorageRef, ViewRef, ResetRef, EditRef) {

    'use strict';

    var returnedApp = function () {

        this.start = function() {
            var myFilter,
                myCreate,
                myView,
                myReset,
                myStorage,
                myEdit;

            // filter
            myFilter = new SortRef();
            myFilter.constructor();
            myFilter.render();

            // create
            myCreate = new CreateRef();
            myCreate.constructor();
            myCreate.render();

            // view
            myView = new ViewRef();
            myView.constructor();
            myView.render();

            // reset
            myReset = new ResetRef();
            myReset.constructor();
            myReset.render();

            // storage
            myStorage = new StorageRef();
            myStorage.constructor();

            // edit
            myEdit = new EditRef();
            myEdit.constructor();




        };

        this.VERSION = 0.1;
    };

    return returnedApp;

});