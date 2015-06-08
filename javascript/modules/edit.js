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

        var handlebarRegionId = 'region-debug';
        var handlebarTemplateId = 'template-edit';
        var handlebarSource = null;
        var handlebarTemplate = null;
        var handlebarContext = null;
        var handleBarHtml = null;

        // private functions
        var prepareEditForm,
            transformFormOptions;

        var publicConstructor = function () {
            $(document).bind('kn:edit', prepareEditForm); // binding context "this" to prepareEditForm()

            handlebarSource = $('#' + handlebarTemplateId).html();
            handlebarTemplate = handlebars.compile(handlebarSource);

        };

        // private functions

        prepareEditForm = function (ev) {
            data = ev.kn.data;
            id = ev.kn.id;

            publicRender();
        };

        var privatePreRender = function () {

            handlebarContext = {
                title: 'edit',
                mode: 'edit',
                formElements: transformFormOptions(config.formOptions, data)
            };

            handleBarHtml = handlebarTemplate(handlebarContext);
        };

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
        };

        // private functions

        /**
         * merges the form data of the to-be-edited note into the form structure from config
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {Array} formOptions
         * @param {Object} data
         * @returns {Array}
         */
        transformFormOptions = function(formOptions, data) {
            var returnData = $.extend({}, formOptions), // shallow clone
                i,
                formOption,
                dateObj,
                date,
                time;

            for (i = 0; i < formOptions.length; i++) {
                formOption = formOptions[i];
                if (typeof formOption.dependant === 'undefined') {
                    if (typeof formOption.dependee !== 'undefined') {
                        if (formOption.type === 'date' && formOptions[formOption.dependee].type === 'time') {
                            // this is a date field and the dependee is a time field -> separate the two values
                            dateObj = new Date(data[formOption.name]);
                            date = auxiliary.formatDateDate(dateObj);
                            time = auxiliary.formatDateTime(dateObj);

                            returnData[i].value = date;
                            returnData[formOption.dependee].value = time;
                        }
                        // @todo maybe add some fallback here to tackle missconfiguration of the config
                    }

                    else {
                        // this field has no dependee -> set its value straight from data
                        returnData[i].value = data[formOption.name];
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