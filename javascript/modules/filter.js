/* globals define:true, console:true, document:true */
define(
    [
        'jQuery',
        'handlebars'
    ], function($, handlebars) {

    'use strict';

    // module
    return function() {

        // configuration

        // class variables
        var $filterFinished = null; // store jquery-element to avoid multiple DOM-queries
        var editRef = null;

        // handlebar settings
        var handlebarRegionId = 'region-filter';
        var handlebarTemplateId = 'template-filter';
        var handlebarSource = null;
        var handlebarTemplate = null;
        var handlebarContext = null;
        var handleBarHtml = null;

        /**
         * constructor
         *
         * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
         */
        var publicConstructor = function() {
            handlebarSource = $('#' + handlebarTemplateId).html();
            handlebarTemplate = handlebars.compile(handlebarSource);
        };

        /**
         * appends the created html into the designated region of the DOM
         *
         * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
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
         * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
         */
        var privatePreRender = function() {
            handlebarContext = {
                title: 'filter'
            };
            handleBarHtml = handlebarTemplate(handlebarContext);
        };

        /**
         * automatically called after the html is appended into the DOM.
         * sets listeners and triggers
         *
         * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
         */
        var privatePostRender = function() {

            // query DOM once, use often
            $filterFinished =  $('#filter-finished');

            if ($filterFinished.is(':checked')) {
                $filterFinished.parent().find('.button-link').addClass('active');
            }

            $filterFinished.on('change', function() {
                // only allow filtering if edit is not active
                if (!privateIsEditActive()) {
                    $.event.trigger({
                        type: 'kn:filter',
                        kn: {
                            type: 'finished',
                            filter: $(this).is(':checked')
                        },
                        time: new Date()
                    });

                    $(this).parent().find('.button-link').toggleClass('active');
                }
            });

            // in edit mode, disable filtering of new notes
            $(document).bind('kn:edit', privateDisableFilter);
            $(document).bind('kn:edit:cancel', privateEnableFilter);
            $(document).bind('kn:data:change', privateEnableFilter);
            $(document).bind('kn:reset:complete', privateEnableFilter);
        };

        /**
         * visually disables the filtering by adding a the 'disabled' css class
         *
         * @author Julian Mollik <jule@creative-coding.net>
         */
        var privateDisableFilter = function() {
            $filterFinished.parent().find('.button-link').addClass('disabled');
        };

        /**
         * visually enabes the filtering by removing the 'disabled' css class
         *
         * @author Julian Mollik <jule@creative-coding.net>
         */
        var privateEnableFilter = function() {
            $filterFinished.parent().find('.button-link').removeClass('disabled');
        };

        /**
         * checks if the editRef is set (should always be the case) and returns the result of editRef's isEditActive()
         * function
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @returns {boolean}
         */
        var privateIsEditActive = function() {
            if (editRef === null) {
                throw Error ('editRef is not set');
            }
            return editRef.isEditActive();
        };

        return {
            constructor: publicConstructor,
            render: publicRender,
            registerEdit: publicRegisterEdit
        };
    };
});