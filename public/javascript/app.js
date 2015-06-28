/* globals define:true, console:true */
define(
    [
        'jQuery',
        'handlebars',
        'config',
        'modules/sort',
        'modules/create',
        'modules/storage',
        //'modules/engine/localstorage', // change storage engine
                                         // @see https://github.com/jule256/killernotes#special-features
        'modules/engine/serverstorage',
        'modules/view',
        'modules/reset',
        'modules/edit',
        'modules/filter',
        'modules/stylepicker',
        'modules/log'
    ], function(
        $,
        handlebars,
        ConfigRef,
        SortRef,
        CreateRef,
        StorageRef,
        StorageEngineRef,
        ViewRef,
        ResetRef,
        EditRef,
        FilterRef,
        StylePickerRef,
        LogRef
    ) {

    'use strict';

    return function() {

        var version = '0.4.0';

        /**
         * starts the application by loading the precompiled templates and after that calling the privateStart()
         *
         * @author Julian Mollik <jule@creative-coding.net>
         */
        var publicStart = function() {

            // put handlebars into the window-object because the precompiled templates/templates.js needs it there
            // @todo check if there is a better way
            window.Handlebars = handlebars;
            // get the precompiled templates.js via ajax
            $.getScript(ConfigRef.templatesPath)
                .done(function(/*script, textStatus*/) {
                    // after templates are loaded and therefore templates are in the window-object,
                    // start the actual application
                    privateStart();
                })
                .fail(function(jqxhr, settings, exception) {
                    throw Error(
                        'could not load precompiled templates from "' + ConfigRef.templatesPath + '", ' +
                        'did you run "gulp" on command line? ',
                        exception
                    );
                });
        };

        /**
         * returns the version of this killernotes App
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @public
         * @returns {string}
         */
        var publicGetVersion = function() {
            return version;
        };

        // private functions

        /**
         * loads and initializes the modules of the application and thus actually starts the app
         *
         * @author Julian Mollik <jule@creative-coding.net>
         */
        var privateStart = function() {
            var myStylepicker,
                mySort,
                myCreate,
                myView,
                myReset,
                myStorageEngine,
                myStorage,
                myEdit,
                myFilter,
                myLog;

            // storage engine
            myStorageEngine = new StorageEngineRef();
            myStorageEngine.constructor();

            // storage
            myStorage = new StorageRef();
            myStorage.constructor();
            myStorage.setEngine(myStorageEngine);

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
            myView.registerStorage(myStorage);
            myView.render();

            // reset
            myReset = new ResetRef();
            myReset.constructor();
            myReset.render();

            // logger
            myLog = new LogRef();
            myLog.constructor();
        };

        return {
            start: publicStart,
            getVersion: publicGetVersion
        };
    };
});