/* globals define:true, console:true */
define(
    [
        'jQuery',
        'handlebars'
    ], function ($, handlebars) {

    'use strict';

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

    // module
    return function () {

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
         */
        var publicConstructor = function() {
            $(document).bind('kn:view:complete', privateHighlightSort);
            $(document).bind('kn:edit', privateDisableSort);
            $(document).bind('kn:edit:cancel', privateEnableSort);
            $(document).bind('kn:edit:save', privateEnableSort);

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

        // private functions

        /**
         * automatically called before the html is appended into the DOM.
         * prepares the handlebar templating (setting context, creating the html)
         *
         * @author Julian Mollik <jule@creative-coding.net>
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
         */
        var privatePostRender = function() {
            $.each(sortOptions, function(key, sortOption) {
                $('#sort-' + sortOption.name).on('click', function() {
                    $.event.trigger({
                        type: 'kn:sort',
                        kn: {
                            sort: sortOption
                        },
                        time: new Date()
                    });
                });
            });
        };

        /**
         * adds the active class to the currently sorted li element
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {object} ev
         */
        var privateHighlightSort = function(ev) {
            $('#sort-container').find('li').removeClass('active');
            $('#sort-' + ev.kn.sort).addClass('active');
        };

        var privateDisableSort = function(ev) {

            console.log('privateDisableSort');

            // add "disabled" class to all sort li elements
            $('#sort-container').find('li').addClass('disabled');
        };

        // CONTINUE HERE -> refactor disabled-classes (inactive -> disabled)
        //               -> implement sorting flag

        var privateEnableSort = function(ev) {

            console.log('privateEnableSort');

            // remove "disabled" class of all sort li elements
            $('#sort-container').find('li').removeClass('disabled');
        };

        return {
            constructor: publicConstructor,
            render: publicRender
        };
    };
});
