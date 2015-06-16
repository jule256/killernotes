/* globals define:true, console:true */
define(
    [
        'jQuery',
        'config',
        'handlebars'
    ], function($, config, handlebars) {

        'use strict';

        // module
        return function() {

            // @todo JSDoc for all functions

            // configuration
            var handlebarRegionId = 'region-stylepicker';
            var handlebarTemplateId = 'template-stylepicker';
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
                    title: 'stylepicker',
                    styles: config.styles
                };
                handleBarHtml = handlebarTemplate(handlebarContext);
            };

            var privatePostRender = function() {
                $('#style-picker').on('change', function() {
                    $('#main-style').attr('href', $(this).val());
                });
            };

            return {
                constructor: publicConstructor,
                render: publicRender
            };
        };
    });