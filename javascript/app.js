/* globals define:true, console:true */
define(
    [
        'jQuery',
        'modules/sort',
        'modules/create',
        'modules/storage',
        'modules/view',
        'modules/reset',
        'modules/edit',
        'modules/filter',
        'modules/stylepicker'
    ], function($, SortRef, CreateRef, StorageRef, ViewRef, ResetRef, EditRef, FilterRef, StylePickerRef) {

    'use strict';

   return function() {

       var version = 0.2;

       var publicStart = function() {
           var mySorter,
               myCreate,
               myView,
               myReset,
               myStorage,
               myEdit,
               myFilter;

           // StylePicker
           mySorter = new StylePickerRef();
           mySorter.constructor();
           mySorter.render();

           // Sorter
           mySorter = new SortRef();
           mySorter.constructor();
           mySorter.render();

           // filter
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

       var publicGetVersion = function() {
           return version;
       };

       return {
           start: publicStart,
           getVersion: publicGetVersion
       };
   };
});