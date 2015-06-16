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

            // configuration
            var handlebarRegionId = 'region-stylepicker';
            var handlebarTemplateId = 'template-stylepicker';
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
             * automatically called before the html is appended into the DOM.
             * prepares the handlebar templating (setting context, creating the html)
             *
             * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
             */
            var privatePreRender = function() {
                handlebarContext = {
                    title: 'stylepicker',
                    styles: config.styles
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