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

        var $submit = null; // store jquery-element to avoid multiple DOM-queries

        // handlebars settings

        var handlebarRegionId = 'region-create';
        var handlebarTemplateId = 'template-create';
        var handlebarSource = null;
        var handlebarTemplate = null;
        var handlebarContext = null;
        var handleBarHtml = null;

        /**
         * constructor
         *
         * @author Julian Mollik <jule@creative-coding.net>
         */
        var publicConstructor = function() {
            handlebars.registerHelper('formElement', auxiliary.handlebarsFormElementHelper);


            handlebarSource = $('#' + handlebarTemplateId).html();
            handlebarTemplate = handlebars.compile(handlebarSource);

            $(document).bind('kn:create', privateResetCreateForm);
        };

        /**
         * appends the created html into the designated region of the DOM
         *
         * @author Julian Mollik <jule@creative-coding.net>
         */
        var publicRender = function() {
            privatePreRender();

            $('#' + handlebarRegionId).html(handleBarHtml);

            privatePostRender();
        };

        // private functions

        /**
         * automatically called before the html is appended into the DOM.
         * prepares the handlebar templating (setting context, creating the html)
         *
         * @author Julian Mollik <jule@creative-coding.net>
         */
        var privatePreRender = function() {
            handlebarContext = {
                title: 'Create new note',
                mode: 'create',
                formElements: config.formElements
            };
            handleBarHtml = handlebarTemplate(handlebarContext);
        };

        /**
         * automatically called after the html is appended into the DOM.
         * sets listeners and triggers
         *
         * @author Julian Mollik <jule@creative-coding.net>
         */
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

            $('.kn-notes-create').on('click', function() {
                var noteIcon = $(this).find('i');
                $(noteIcon).toggleClass('fa-minus');
                $(noteIcon).toggleClass('fa-plus');
                $(this).toggleClass('active');

                $('.kn-create-form').toggle();
            });

            // in edit mode, disable saving of new notes
            $(document).bind('kn:edit', privateDisableCreate);
            $(document).bind('kn:edit:cancel', privateEnableCreate);
            $(document).bind('kn:data:change', privateEnableCreate);
        };

        /**
         * resets the create form by re-rendering it
         *
         * @author Julian Mollik <jule@creative-coding.net>
         */
        var privateResetCreateForm = function() {
            publicRender();
        };

        /**
         * disables the create form by disabling the submit button
         *
         * @author Julian Mollik <jule@creative-coding.net>
         */
        var privateDisableCreate = function() {
            $submit.attr('disabled', true);
        };

        /**
         * enabes the create form by enabling the submit button
         *
         * @author Julian Mollik <jule@creative-coding.net>
         */
        var privateEnableCreate = function() {
            $submit.removeAttr('disabled');
        };

        return {
            constructor: publicConstructor,
            render: publicRender
        };
    };
});
