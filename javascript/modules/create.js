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

    // module
    var returnedCreate = function () {

        // configuration

        // class variables

        var $submit = null; // store jquery-element to avoid multiple DOM-queries

        // handlebars settings

        var handlebarRegionId = 'region-create';
        var handlebarTemplateId = 'template-create';
        var handlebarSource = null;
        var handlebarTemplate = null;
        var handlebarContext = null;
        var handleBarHtml = null;

        // private functions
        var disableCreate,
            enableCreate;

        this.constructor = function() {
            handlebars.registerHelper('formelement', auxiliary.handlebarsFormElementHelper);
        };

        this.preRender = function() {
            handlebarSource = $('#' + handlebarTemplateId).html();
            handlebarTemplate = handlebars.compile(handlebarSource);
            handlebarContext = {
                title: 'create',
                mode: 'create',
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
            $submit = $('#create-submit');

            $submit.on('click', function(ev) {
                $.event.trigger({
                    type: 'kn:create',
                    kn: {
                        data: auxiliary.extractData('create')
                    },
                    time: new Date()
                });
            });

            // in edit mode, disable saving of new notes
            $(document).bind('kn:edit', disableCreate);
            $(document).bind('kn:edit:cancel', enableCreate);
            $(document).bind('kn:data:change', enableCreate);
        };

        // private functions

        disableCreate = function() {
            $submit.attr('disabled', true);
        };

        enableCreate = function() {
            $submit.removeAttr('disabled');
        };
    };

    return returnedCreate;
});