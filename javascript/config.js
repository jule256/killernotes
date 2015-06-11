/* global define:true, console:true */
define([], function () {

    'use strict';

    return {
        localStorageName: 'kn:storage',
        defaultSort: 'duedate',
        defaultShowFinished: false,
        formElements: [
            {
                id: 0,
                name: 'title',
                title: 'Title',
                type: 'input'
            },
            {
                id: 1,
                name: 'importance',
                title: 'Importance',
                type: 'rating',
                max: 5
            },
            {
                id: 2,
                name: 'duedate',
                title: 'Due',
                type: 'date',
                dependee: 3, // defines that this item uses formElements[4]
                value: 'tomorrow' // will be converted to current-date plus 24h during runtime
            },
            {
                id: 3,
                name: 'duetime',
                title: 'Duetime',
                type: 'time',
                dependant: 2, // defines that this item is used by formElements[3]
                value: 'now' // will be converted to current time during runtime
            },
            {
                id: 4,
                name: 'finished',
                title: 'Finished?',
                type: 'checkbox'
            },
            {
                id: 5,
                name: 'note',
                title: 'Note',
                type: 'text'
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
        ]
    };
});