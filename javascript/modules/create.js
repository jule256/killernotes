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
    return function () {

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

        var publicConstructor = function() {
            handlebars.registerHelper('formelement', auxiliary.handlebarsFormElementHelper);

            handlebarSource = $('#' + handlebarTemplateId).html();
            handlebarTemplate = handlebars.compile(handlebarSource);

        };

        var privatePreRender = function() {
            handlebarContext = {
                title: 'create',
                mode: 'create',
                formElements: config.formOptions
            };
            handleBarHtml = handlebarTemplate(handlebarContext);
        };

        var publicRender = function() {
            privatePreRender();

            $('#' + handlebarRegionId).html(handleBarHtml);

            privatePostRender();
        };

        var privatePostRender = function() {
            $submit = $('#create-submit');

            $submit.on('click', function() {
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

        return {
            constructor: publicConstructor,
            render: publicRender
        };
    };
});