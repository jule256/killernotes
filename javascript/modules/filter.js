/* globals define:true, console:true */
define(
    [
        'jQuery',
        'handlebars',
        'config',
        'auxiliary'
    ], function ($, handlebars) {

        'use strict';

        // module
        return function () {

            // configuration


            var handlebarRegionId = 'region-filter';
            var handlebarTemplateId = 'template-filter';
            var handlebarSource = null;
            var handlebarTemplate = null;
            var handlebarContext = null;
            var handleBarHtml = null;

            var publicConstructor = function() {
                handlebarSource = $('#' + handlebarTemplateId).html();
                handlebarTemplate = handlebars.compile(handlebarSource);
            };

            var publicRender = function() {
                privatePreRender();

                $('#' + handlebarRegionId).html(handleBarHtml);

                privatePostRender();
            };

            var privatePreRender = function() {
                handlebarContext = {
                    title: 'filter'
                };
                handleBarHtml = handlebarTemplate(handlebarContext);
            };

            var privatePostRender = function() {
                $('#filter-finished').on('change', function() {
                    $.event.trigger({
                       type: 'kn:filter',
                        kn: {
                            type: "finished",
                            filter: $(this).is(':checked')
                        },
                        time: new Date()
                    });
                });
            };

            return {
                constructor: publicConstructor,
                render: publicRender
            };
        };
    });