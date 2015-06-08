/* globals define:true, console:true */
define(
    [
        'jQuery',
        'handlebars'
    ], function ($, handlebars) {

        'use strict';

        // module
        return function () {

            // configuration
            var styles = [
                {
                    name: 'Default',
                    path: 'resource/main.css'
                },
                {
                    name: 'Contrast',
                    path: 'resource/main-secondary.css'
                }
            ]; // TODO: include in config

            var handlebarRegionId = 'region-stylepicker';
            var handlebarTemplateId = 'template-stylepicker';
            var handlebarSource = null;
            var handlebarTemplate = null;
            var handlebarContext = null;
            var handleBarHtml = null;

            var publicConstructor = function () {
                handlebarSource = $('#' + handlebarTemplateId).html();
                handlebarTemplate = handlebars.compile(handlebarSource);
            };

            var publicRender = function () {
                privatePreRender();

                $('#' + handlebarRegionId).html(handleBarHtml);

                privatePostRender();
            };

            var privatePreRender = function () {
                handlebarContext = {
                    title: 'stylepicker',
                    styles: styles
                };
                handleBarHtml = handlebarTemplate(handlebarContext);
            };

            var privatePostRender = function () {
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