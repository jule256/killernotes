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
        var returnedFilter = function () {

            // configuration


            var handlebarRegionId = 'region-filter';
            var handlebarTemplateId = 'template-filter';
            var handlebarSource = null;
            var handlebarTemplate = null;
            var handlebarContext = null;
            var handleBarHtml = null;

            // private functions
            var getFormElementHtml,
                handlebarsFormElementHelper,
                extractCreateData;

            this.constructor = function() {

            };

            this.preRender = function() {
                handlebarSource = $('#' + handlebarTemplateId).html();
                handlebarTemplate = handlebars.compile(handlebarSource);
                handlebarContext = {
                    title: 'filter'
                };
                handleBarHtml = handlebarTemplate(handlebarContext);
            };

            this.render = function() {
                this.preRender();

                $('#' + handlebarRegionId).html(handleBarHtml);

                this.postRender();
            };

            this.postRender = function() {
                $('#filter-finished').on('change', function(ev) {
                    $.event.trigger({
                       type: 'kn:filter',
                        kn: {
                            filter: $(this).is(':checked')
                        },
                        time: new Date()
                    });
                });
            };

            // private functions

        };

        return returnedFilter;

    });