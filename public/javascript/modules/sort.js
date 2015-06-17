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
        var sortOptions = [
            {
                id: 1,
                name: 'duedate',
                title: 'By Duedate'
            },
            {
                id: 2,
                name: 'createdate',
                title: 'By created Date'
            },
            {
                id: 3,
                name: 'importance',
                title: 'By Importance'
            }
        ];

        // class variables
        var editRef = null;

        // handlebar settings
        var handlebarRegionId = 'region-sort';
        var handlebarTemplateId = 'template-sort';
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
            $(document).bind('kn:view:complete', privateHighlightSort);
            $(document).bind('kn:edit', privateDisableSort);
            $(document).bind('kn:edit:cancel', privateEnableSort);
            $(document).bind('kn:data:change', privateEnableSort);
            $(document).bind('kn:reset:complete', privateEnableSort);

            handlebarSource = $('#' + handlebarTemplateId).html();
            handlebarTemplate = handlebars.compile(handlebarSource);
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
                title: 'sort',
                sortOptions: sortOptions
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
            $.each(sortOptions, function(key, sortOption) {
                $('#sort-' + sortOption.name).on('click', function() {
                    if (!privateIsEditActive()) {
                        // only trigger event if there is no other edit-process in progress
                        $.event.trigger({
                            type: 'kn:sort',
                            kn: {
                                sort: sortOption
                            },
                            time: new Date()
                        });
                    }
                });
            });
        };

        /**
         * adds the active class to the currently sorted li element
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {object} ev
         * @private
         */
        var privateHighlightSort = function(ev) {
            $('#sort-container').find('li').removeClass('active');
            $('#sort-' + ev.kn.sort).addClass('active');
        };

        var privateDisableSort = function(/*ev*/) {
            // add "disabled" class to all sort li elements
            $('#sort-container').find('li').addClass('disabled');
        };

        var privateEnableSort = function(/*ev*/) {
            // remove "disabled" class of all sort li elements
            $('#sort-container').find('li').removeClass('disabled');
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

        return {
            constructor: publicConstructor,
            render: publicRender,
            registerEdit: publicRegisterEdit
        };
    };
});
