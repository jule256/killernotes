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
    var returnedSort = function () {

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

        this.constructor = function() {
            handlebars.registerHelper('sortlist', handlebarsSortlistHelper);
            $(document).bind('kn:view:complete', highlightSort);
        };

        this.preRender = function() {
            handlebarSource = $('#' + handlebarTemplateId).html();
            handlebarTemplate = handlebars.compile(handlebarSource);
            handlebarContext = {
                title: 'sort',
                sortOptions: sortOptions
            };
            handleBarHtml = handlebarTemplate(handlebarContext);
        };

        this.render = function() {
            this.preRender();

            $('#' + handlebarRegionId).html(handleBarHtml);

            this.postRender();
        };

        this.postRender = function() {
            $.each(sortOptions, function(key, sortOption) {
                $('#sort-' + sortOption.name).on('click', function(ev) {
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

        handlebarsSortlistHelper = function(items, options) {
            var out = '<ul id="sort-container">',
                i,
                l = items.length;

            for (i = 0; i < l; i++) {
                // options.fn(items[i])
                out = out + '<li id="sort-' + items[i].name + '">' + items[i].title + '</li>';
            }

            return out + "</ul>";
        };

        highlightSort = function(ev) {
            $('#sort-container li').removeClass('active');
            $('#sort-' + ev.kn.sort).addClass('active');
        };



    };

    return returnedSort;

});