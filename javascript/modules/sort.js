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

        // private functions
        var handlebarsSortlistHelper,
            highlightSort;

        var publicConstructor = function() {
            $(document).bind('kn:view:complete', highlightSort);

            handlebarSource = $('#' + handlebarTemplateId).html();
            handlebarTemplate = handlebars.compile(handlebarSource);

        };

        var privatePreRender = function() {
            handlebarContext = {
                title: 'sort',
                sortOptions: sortOptions
            };
            handleBarHtml = handlebarTemplate(handlebarContext);
        };

        var publicRender = function() {
            privatePreRender();

            $('#' + handlebarRegionId).html(handleBarHtml);

            privatePostRender();
        };

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

        highlightSort = function(ev) {
            $('#sort-container').find('li').removeClass('active');
            $('#sort-' + ev.kn.sort).addClass('active');
        };

        return {
            constructor: publicConstructor,
            render: publicRender
        };
    };
});