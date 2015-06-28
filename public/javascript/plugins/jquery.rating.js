define(
    [
        'jQuery'
    ], function($) {

        'use strict';

        /**
         * Rating plugin for Killernotes app
         *
         * @author dominik süsstrunk <dominik.suesstrunk@gmail.com>
         * @param {object} options
         */
        $.fn.rating = function(options) {

            // private vars
            var settings = $.extend({
                matchElement: 'em',
                readOnly: false,
                value: 0,
                activeClass: 'active',
                inactiveClass: 'inactive',
                dataValueAttribute: 'data-rating-value',
                callback: null
            }, options);

            // private methods

            /**
             * Set the rating value
             *
             * @author dominik süsstrunk <dominik.suesstrunk@gmail.com>
             * @param {object} element
             * @param {number} value
             * @param {boolean} setValue
             * @returns {number}
             */
            var privateSetRating = function(element, value, setValue) {
                if (setValue === true) {
                    $(element).attr(settings.dataValueAttribute, value);
                    if (settings.callback) {
                        settings.callback(value);
                    }
                }

                $(element).children(settings.matchElement).each(function(index) {
                    if (setValue === true) {
                        $(this).attr(settings.dataValueAttribute, index + 1);
                    }

                    if (index < value) {
                        $(this).removeClass(settings.inactiveClass);
                        $(this).addClass(settings.activeClass);
                    }
                    else {
                        $(this).removeClass(settings.activeClass);
                        $(this).addClass(settings.inactiveClass);
                    }
                });

                return value;
            };

            /**
             * Add eventHandlers to rating items
             *
             * @author dominik süsstrunk <dominik.suesstrunk@gmail.com>
             * @param {object} element
             */
            var privateAddHandlers = function(element) {
                $(element).children(settings.matchElement).on('mouseenter', function() {
                    privateSetRating($(this).parent(), $(this).attr(settings.dataValueAttribute), false);
                });

                $(element).children(settings.matchElement).on('click', function() {
                    var value = $(this).attr(settings.dataValueAttribute);
                    privateSetRating($(this).parent(), value, true);
                });

                $(element).on('mouseout', function() {
                    privateSetRating(this, $(this).attr(settings.dataValueAttribute), true);
                });
            };

            if (settings.readOnly === false) {
                privateAddHandlers(this);
            }

            privateSetRating(this, settings.value, true);
        };
    });