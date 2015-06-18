/* globals define:true, console:true, document:true */
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

            // class variables
            var message = null,
                level;

            // private functions
            var privateLogMessage;

            // handlebar settings
            var handlebarRegionId = 'region-log';
            var handlebarTemplateId = 'template-log';
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

                $(document).on('kn:log:message', privateLogMessage);
            };

            /**
             * appends the created html into the designated region of the DOM
             *
             * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
             */
            var privateRender = function() {
                privatePreRender();

                $('#' + handlebarRegionId).html(handleBarHtml);

                privatePostRender();
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
                    title: 'info',
                    message: message,
                    level: level
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
               var $logMessage = $('.kn-log-message');
                $logMessage.slideDown(150);
                $logMessage.delay(config.uiLogShowDuration).slideUp(150);
            };

            /**
             * Shows the info message, if level is appropriate
             *
             * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
             */
            privateLogMessage = function(ev) {
                message = ev.kn.message;
                level = ev.kn.level;

                if (ev.kn.showOnUi && config.uiLogLevel <= level) {
                    privateRender();
                }

                if (config.consoleLogLevel <= level) {
                    switch (level) {
                        case config.logLevels.error:
                            console.error(message);
                            break;
                        case config.logLevels.warning:
                            console.warn(message);
                            break;
                        case config.logLevels.info:
                            console.info(message);
                            break;
                        case config.logLevels.none:
                            break;
                        default:
                            console.log(message);
                    }
                }
            };

            return {
                constructor: publicConstructor
            };
        };
    });