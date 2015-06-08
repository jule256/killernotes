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
                name: 'note',
                title: 'Note',
                type: 'text'
            },
            {
                id: 2,
                name: 'importance',
                title: 'Importance',
                type: 'select',
                options: {
                    0: '0 stars',
                    1: '1 star',
                    2: '2 stars',
                    3: '3 stars',
                    4: '4 stars',
                    5: '5 stars'
                }
            },
            {
                id: 3,
                name: 'duedate',
                title: 'Duedate',
                type: 'date',
                dependee: 4, // defines that this item uses formElements[4]
                value: 'tomorrow' // will be converted to current-date plus 24h during runtime
            },
            {
                id: 4,
                name: 'duetime',
                title: 'Duetime',
                type: 'time',
                dependant: 3, // defines that this item is used by formElements[3]
                value: 'now' // will be converted to current time during runtime
            },
            {
                id: 5,
                name: 'finished',
                title: 'Finished?',
                type: 'checkbox'
            }
        ]
    };
});