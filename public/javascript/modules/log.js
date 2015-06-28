/* globals define:true, console:true, document:true, killernotes:true */
define(
    [
        'jQuery',
        'config'
    ], function($, config) {

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
            var handlebarTemplate = null;
            var handlebarContext = null;
            var handleBarHtml = null;

            /**
             * constructor
             *
             * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
             */
            var publicConstructor = function() {
                handlebarTemplate = killernotes.templates.log;

                $(document).off('kn:log:message', privateLogMessage);
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
             * @private
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
             * @private
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
             * @private
             */
            privateLogMessage = function(ev) {
                var additionalData = ev.kn.additionalData;

                message = ev.kn.message;
                level = ev.kn.level;

                if (ev.kn.showOnUi && config.uiLogLevel <= level) {
                    privateRender();
                }

                if (config.consoleLogLevel <= level) {
                    switch (level) {
                        case config.logLevels.error:
                            console.error(message, additionalData);
                            break;
                        case config.logLevels.warning:
                            console.warn(message, additionalData);
                            break;
                        case config.logLevels.info:
                            console.info(message, additionalData);
                            break;
                        case config.logLevels.none:
                            break;
                        default:
                            console.log(message, additionalData);
                    }
                }
            };

            return {
                constructor: publicConstructor
            };
        };
    });