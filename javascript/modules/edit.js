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
    var returnedEdit = function () {

        // configuration

        // handlebar settings

        var handlebarRegionId = 'region-debug';
        var handlebarTemplateId = 'template-edit';
        var handlebarSource = null;
        var handlebarTemplate = null;
        var handlebarContext = null;
        var handleBarHtml = null;

        // private functions
        var showEditForm,
            transformFormOptions;

        this.constructor = function () {
            $(document).bind('kn:edit', showEditForm);
        };

        this.preRender = function () {

        };

        this.render = function () {
            this.preRender();

            this.postRender();
        };

        this.postRender = function () {

        };

        // private functions

        showEditForm = function (ev) {
            var id = ev.kn.id,
                data = ev.kn.data;

            handlebarSource = $('#' + handlebarTemplateId).html();
            handlebarTemplate = handlebars.compile(handlebarSource);
            handlebarContext = {
                title: 'edit',
                formElements: transformFormOptions(config.formOptions, data)
            };
            handleBarHtml = handlebarTemplate(handlebarContext);

            // testing
            $('#' + handlebarRegionId).html(handleBarHtml);

            // CONTINUE HERE -> tidy up code
            //                  add listeners to cancel & save
            //                  replace the actual node instead of using #region-edit
        };

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
                            date =
                                dateObj.getFullYear() + '-' +
                                auxiliary.pad2Digits(dateObj.getMonth()) + '-' +
                                auxiliary.pad2Digits(dateObj.getDay());
                            time =
                                auxiliary.pad2Digits(dateObj.getHours()) + ':' +
                                auxiliary.pad2Digits(dateObj.getMinutes()) + ':00.000';
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

            console.log('transformFormOptions() returnData:', returnData);

            return returnData;
        };


        /**/
    };

    return returnedEdit;
});