/* globals define:true, console:true, document:true */
define(
    [
        'jQuery',
        'handlebars',
        'config',
        'auxiliary',
        'validate'
    ], function($, handlebars, config, auxiliary, validate) {

    'use strict';

    // module
    return function() {

        // configuration

        // class variables
        var $submit = null; // store jquery-element to avoid multiple DOM-queries
        var $createToggle = null; // store jquery-element to avoid multiple DOM-queries
        var editRef = null;

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
         * @constructor
         */
        var publicConstructor = function() {
            handlebars.registerHelper('formElement', auxiliary.handlebarsFormElementHelper);
            handlebars.registerHelper('times', auxiliary.handlebarsForLoop);

            handlebarSource = $('#' + handlebarTemplateId).html();
            handlebarTemplate = handlebars.compile(handlebarSource);

            $(document).bind('kn:create', privateResetCreateForm);
            $(document).bind('kn:create:validation:failed', privateShowError);

            //TODO: richtiger ort hier? oder methode publicRegisterEvents?
            $('body').on('click', '.kn-notes-create', function() {
                // only show create-form if edit is not active
                if (!privateIsEditActive()) {
                    privateToggleCreateForm();
                }
            });
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

        /**
         * registeres the given editRefParam in this class to be able to query if for "is edit active"
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {object} editRefParam
         */
        var publicRegisterEdit = function(editRefParam) {
            editRef = editRefParam;
        };

        // private functions

        /**
         * automatically called before the html is appended into the DOM.
         * prepares the handlebar templating (setting context, creating the html)
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @private
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
         * @private
         */
        var privatePostRender = function() {
            var data,
                validation;

            // query DOM once, use often
            $submit = $('#create-submit');
            $createToggle = $('.kn-notes-create');

            $submit.on('click', function() {
                data = auxiliary.extractData('create');
                validation = validate.validateFormData(data);

                if (!privateIsEditActive()) {
                    // only allow submit if edit is not active
                    if (validation.failed) {
                        $.event.trigger({
                            type: 'kn:create:validation:failed',
                            kn: {
                                messages: validation.messages,
                                mode: 'create'
                            }
                        });
                    }
                    else {
                        $.event.trigger({
                            type: 'kn:create',
                            kn: {
                                data: data
                            },
                            time: new Date()
                        });
                    }
                }
            });

            // add rating event
            auxiliary.ratingHelper();

            // in edit mode, disable saving of new notes
            $(document).bind('kn:edit', privateDisableCreate);
            $(document).bind('kn:edit:cancel', privateEnableCreate);
            $(document).bind('kn:data:change', privateEnableCreate);
            $(document).bind('kn:reset:complete', privateEnableCreate);
        };

        /**
         * Toggles the create form
         *
         * @author dominik süsstrunk <dominik.suesstrunk@gmail.com>
         * @private
         */
        var privateToggleCreateForm = function() {

            var $noteIcon = $createToggle.find('.kn-icon');
            $noteIcon.toggleClass('fa-minus');
            $noteIcon.toggleClass('fa-plus');
            $createToggle.toggleClass('active');

            $('.kn-form-create').toggle();
        };

        /**
         * resets the create form by re-rendering it
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @private
         */
        var privateResetCreateForm = function() {
            privateToggleCreateForm();
            publicRender();
        };

        /**
         * disables the create form by disabling the submit button and visually disabling the form-toggle by adding
         * the css class 'disabled'
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @private
         */
        var privateDisableCreate = function() {
            $submit.attr('disabled', true);
            $createToggle.addClass('disabled'); // @todo Dominik "not-allowed" cursor is overruled by "pointer" curser
        };

        /**
         * enabes the create form by enabling the submit button and visually enabling the form-toggle by removing
         * the css class 'disabled'
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @private
         */
        var privateEnableCreate = function() {
            $submit.removeAttr('disabled');
            $createToggle.removeClass('disabled'); // @todo Dominik fix "not-allowed" cursor
        };

        /**
         * checks if the editRef is set (should always be the case) and returns the result of editRef's isEditActive()
         * function
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @returns {boolean}
         * @private
         */
        var privateIsEditActive = function() {
            if (editRef === null) {
                throw Error ('editRef is not set');
            }
            return editRef.isEditActive();
        };

        /**
         * takes the error messages from the given ev.kn, adds them to the according error-div in the DOM and
         * visually displays the error
         *
         * @todo is duplicated code. Same code appears in privateShowError() of view.js
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {object} ev
         * @private
         */
        var privateShowError = function(ev) {
            var allMessages = ev.kn.messages,
                mode = ev.kn.mode,
                i,
                concatinatedMessage,
                $formField,
                $errorDiv;

            $.each(allMessages, function(key, messages) {
                $formField = $('#' + mode + '-' + key);
                $errorDiv = $('#' + mode + '-' + key + '-error');

                // add error class to form-field
                $formField.addClass('error');
                concatinatedMessage = [];
                for (i = 0; i < messages.length; i++) {
                    concatinatedMessage.push(messages[i]);
                }

                $errorDiv.removeClass('hide'); // @todo or fancy effect?
                $errorDiv.html(concatinatedMessage.join('<br />'));
            });
        };

        return {
            constructor: publicConstructor,
            render: publicRender,
            registerEdit: publicRegisterEdit
        };
    };
});
