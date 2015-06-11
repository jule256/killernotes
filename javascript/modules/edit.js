/* globals define:true, console:true */
define(
    [
        'jQuery',
        'handlebars',
        'config',
        'auxiliary'
    ], function ($, handlebars, config, auxiliary) {

    'use strict';

    // module
    return function () {

        // configuration

        // class variables

        var data = null; // the data of the currently in edit mode note
        var id = null; // the id (aka create-timestamp) of the currently in edit mode note

        // handlebar settings

        var handlebarTemplateId = 'template-edit';
        var handlebarSource = null;
        var handlebarTemplate = null;
        var handlebarContext = null;
        var handleBarHtml = null;

        // private functions

        /**
         * constructor
         *
         * @author Julian Mollik <jule@creative-coding.net>
         */
        var publicConstructor = function () {
            $(document).bind('kn:edit', privatePrepareEditForm);

            handlebarSource = $('#' + handlebarTemplateId).html();
            handlebarTemplate = handlebars.compile(handlebarSource);
        };

        /**
         * appends the created html into the designated region of the DOM
         *
         * @author Julian Mollik <jule@creative-coding.net>
         */
        var publicRender = function() {
            var noteContainer;

            privatePreRender();

            // find the container of the to-be-edited note
            noteContainer = $('#note-' + id);
            if (noteContainer.length === 0) {
                throw Error('no DOM element with id "#note-' + id + '" found');
            }

            // replace view by edit form
            noteContainer.html(handleBarHtml);

            privatePostRender();
        };

        // private functions

        /**
         * extracts the data of the to-be-edited note and calls the render function
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {object} ev
         */
        var privatePrepareEditForm = function (ev) {
            data = ev.kn.data;
            id = ev.kn.id;

            publicRender();
        };

        /**
         * automatically called before the html is appended into the DOM.
         * prepares the handlebar templating (setting context, creating the html)
         *
         * @author Julian Mollik <jule@creative-coding.net>
         */
        var privatePreRender = function () {
            handlebarContext = {
                title: 'edit',
                mode: 'edit',
                formElements: privateTransformFormElements(config.formElements, data)
            };

            handleBarHtml = handlebarTemplate(handlebarContext);
        };

        /**
         * automatically called after the html is appended into the DOM.
         * sets listeners and triggers
         *
         * @author Julian Mollik <jule@creative-coding.net>
         */
        var privatePostRender = function () {

            $('#edit-submit').on('click', function () {
                $.event.trigger({
                    type: 'kn:edit:save',
                    kn: {
                        id: id,
                        data: auxiliary.extractData('edit')
                    },
                    time: new Date()
                });
            });

            $('#edit-cancel').on('click', function () {
                $.event.trigger({
                    type: 'kn:edit:cancel',
                    kn: {},
                    time: new Date()
                });
            });

            auxiliary.ratingHelper('#edit-importance');
        };

        /**
         * merges the form data of the to-be-edited note into the form structure from config
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {Array} formElements
         * @param {Object} data
         * @returns {Array}
         */
        var privateTransformFormElements = function(formElements, data) {
            var returnData = $.extend({}, formElements), // shallow clone
                i,
                formElement,
                dateObj,
                date,
                time;

            for (i = 0; i < formElements.length; i++) {
                formElement = formElements[i];
                if (typeof formElement.dependant === 'undefined') {
                    if (typeof formElement.dependee !== 'undefined') {
                        if (formElement.type === 'date' && formElements[formElement.dependee].type === 'time') {
                            // this is a date field and the dependee is a time field -> separate the two values
                            dateObj = new Date(data[formElement.name]);
                            date = auxiliary.formatDateDate(dateObj);
                            time = auxiliary.formatDateTime(dateObj);

                            returnData[i].value = date;
                            returnData[formElement.dependee].value = time;
                        }
                        // @todo maybe add some fallback here to tackle missconfiguration of the config
                    }

                    else {
                        // this field has no dependee -> set its value straight from data
                        returnData[i].value = data[formElement.name];
                    }
                }
            }
            return returnData;
        };

        return {
            constructor: publicConstructor,
            render: publicRender
        };
    };
});
