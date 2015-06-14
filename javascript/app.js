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

       var version = 0.3;

       var publicStart = function() {
           var myStylepicker,
               mySort,
               myCreate,
               myView,
               myReset,
               myStorage,
               myEdit,
               myFilter;

           // StylePicker
           myStylepicker = new StylePickerRef();
           myStylepicker.constructor();
           myStylepicker.render();

           // edit
           myEdit = new EditRef();
           myEdit.constructor();

           // create
           myCreate = new CreateRef();
           myCreate.constructor();
           myCreate.registerEdit(myEdit);
           myCreate.render();

           // sort
           mySort = new SortRef();
           mySort.constructor();
           mySort.registerEdit(myEdit);
           mySort.render();

           // filter
           myFilter = new FilterRef();
           myFilter.constructor();
           myFilter.registerEdit(myEdit);
           myFilter.render();

           // view
           myView = new ViewRef();
           myView.constructor();
           myView.registerEdit(myEdit);
           myView.render();

           // reset
           myReset = new ResetRef();
           myReset.constructor();
           myReset.render();

           // storage
           myStorage = new StorageRef();
           myStorage.constructor();
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