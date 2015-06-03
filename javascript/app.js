/* global define:true, console:true */
define(
    [
        'jQuery',
        'modules/sort',
        'modules/create',
        'modules/storage',
        'modules/view',
        'modules/reset',
        'modules/edit',
        'modules/filter'
    ], function ($, SortRef, CreateRef, StorageRef, ViewRef, ResetRef, EditRef, FilterRef) {

    'use strict';

    var returnedApp = function () {

        this.start = function() {
            var mySorter,
                myCreate,
                myView,
                myReset,
                myStorage,
                myEdit,
                myFilter;

            // filter
            mySorter = new SortRef();
            mySorter.constructor();
            mySorter.render();

            // edit
            myFilter = new FilterRef();
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