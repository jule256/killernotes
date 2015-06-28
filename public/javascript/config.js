/* global define:true, console:true */
define([], function() {

    'use strict';

    var logLevels = {
        all: 0,
        info: 10,
        success: 20,
        warning: 30,
        error: 40,
        none: 9999
    };

    return {
        defaultSort: 'duedate',
        defaultShowFinished: false,
        formElements: [
            {
                id: 0,
                name: 'title',
                title: 'Title',
                type: 'input',
                validator: {
                    notEmpty: true,
                    length: {
                        min: 3,
                        max: 30
                    }
                }
            },
            {
                id: 1,
                name: 'finished',
                title: 'Finished?',
                type: 'checkbox',
                validator: {

                }
            },
            {
                id: 2,
                name: 'importance',
                title: 'Importance',
                type: 'rating',
                validator: {
                    values: {
                        // whitelist should consist of strings because eqeqeq-comparison will be used
                        whitelist: [ '0', '1', '2', '3', '4', '5' ]
                    }
                },
                max: 5
            },
            {
                id: 3,
                name: 'duedate',
                title: 'Due',
                type: 'date',
                dependee: 4, // defines that this item uses formElements[4]
                value: 'tomorrow', // will be converted to current-date plus 24h during runtime
                validator: {
                    notEmpty: true,
                    datetime: true
                }
            },
            {
                id: 4,
                name: 'duetime',
                title: 'Duetime',
                type: 'time',
                dependant: 3, // defines that this item is used by formElements[3]
                value: 'now', // will be converted to current time during runtime
                validator: {
                    // since 'time' is a dependee, its value will be validated by its dependant
                }
            },
            {
                id: 5,
                name: 'note',
                title: 'Note',
                type: 'text',
                validator: {
                    length: {
                        min: 3,
                        max: 30
                    }
                }
            }
        ],
        styles: [
            {
                name: 'Default',
                path: 'resource/main.css'
            },
            {
                name: 'Fancy',
                path: 'resource/main-secondary.css'
            }
        ],
        dataRefreshIntervall: 10000, // in ms
        logLevels: logLevels,
        uiLogShowDuration: 1500,
        uiLogLevel: logLevels.all,
        consoleLogLevel: logLevels.all,
        templatesPath: '../templates/templates.js' // relative to public/javscript/app.js
    };
});