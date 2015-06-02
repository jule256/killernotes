/* global define:true, console:true */
define([], function () {

    'use strict';

    return {
        localStorageName: 'kn:storage',
        defaultSort: 'duedate',
        formOptions: [
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
                dependee: 4 // defines that this item uses formOptions[4]
            },
            {
                id: 4,
                name: 'duetime',
                title: 'Duetime',
                type: 'time',
                dependant: 3 // defines that this item is used by formOptions[3]
            }
        ]
    };
});