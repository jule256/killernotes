/* globals define:true, console:true */
define(
    [
        'jQuery',
        'handlebars',
        'config',
        'auxiliary'
    ], function ($, handlebars, config, auxiliary) {

    'use strict';

    // @todo form default values for duedate/duetime
    //       sorting of duedate/duetime

    // module
    var returnedCreate = function () {

        // configuration


        var handlebarRegionId = 'region-create';
        var handlebarTemplateId = 'template-create';
        var handlebarSource = null;
        var handlebarTemplate = null;
        var handlebarContext = null;
        var handleBarHtml = null;

        // private functions
        var getFormElementHtml,
            handlebarsFormElementHelper,
            extractCreateData;

        this.constructor = function() {
            handlebars.registerHelper('formelement', auxiliary.handlebarsFormElementHelper);
        };

        this.preRender = function() {
            handlebarSource = $('#' + handlebarTemplateId).html();
            handlebarTemplate = handlebars.compile(handlebarSource);
            handlebarContext = {
                title: 'create',
                formElements: config.formOptions
            };
            handleBarHtml = handlebarTemplate(handlebarContext);
        };

        this.render = function() {
            this.preRender();

            $('#' + handlebarRegionId).html(handleBarHtml);

            this.postRender();
        };

        this.postRender = function() {
            $('#create-submit').on('click', function(ev) {
                $.event.trigger({
                    type: 'kn:create',
                    kn: {
                        data: extractCreateData()
                    },
                    time: new Date()
                });
            });
        };

        // private functions

        // @todo data evaluation?
        extractCreateData = function() {
            var data = {},
                date,
                time,
                formOptions = config.formOptions;
            $.each(formOptions, function(key, formElement) {
                if (typeof formElement.dependant === 'undefined') {
                    if (typeof formElement.dependee !== 'undefined') {
                        if (formElement.type === 'date' && formOptions[formElement.dependee].type === 'time') {
                            // this is a date field and the dependee is a time field -> merge the two values
                            date = $('#create-' + formElement.name).val();
                            time = $('#create-' + formOptions[formElement.dependee].name).val();
                            data[formElement.name] = Date.parse(date + ' ' + time);
                        }
                        // @todo maybe add some fallback here to tackle missconfiguration of the config
                    }
                    else {
                        // this field has no dependee -> get its value straight from DOM
                        data[formElement.name] = $('#create-' + formElement.name).val();
                    }
                }
            });
            return data;
        };
    };

    return returnedCreate;

});