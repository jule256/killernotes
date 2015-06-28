/* globals define:true, console:true, killernotes:true, confirm:true */
define(
    [
        'jQuery'
    ], function($) {

    'use strict';

    // configuration

    // module
    return function() {

        // @todo JSDoc for all functions

        // handlebar settings
        var handlebarRegionId = 'region-reset';
        var handlebarTemplate = null;
        var handlebarContext = null;
        var handleBarHtml = null;

       /**
        * constructor
        *
        * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
        * @constructor
        */
        var publicConstructor = function() {
           handlebarTemplate = killernotes.templates.reset;
        };

       /**
        * appends the created html into the designated region of the DOM
        *
        * @author Julian Mollik <jule@creative-coding.net>
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
         * @author Julian Mollik <jule@creative-coding.net>
         * @private
         */
         var privatePreRender = function() {
             handlebarContext = {
                 title: 'reset'
             };
             handleBarHtml = handlebarTemplate(handlebarContext);
         };

        /**
         * automatically called after the html is appended into the DOM.
         * sets listeners and triggers
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @private
         */
         var privatePostRender = function() {
             $('#reset').on('click', function() {
                 if (confirm('Do you really want to delete all notes?')) {
                     $.event.trigger({
                         type: 'kn:reset',
                         kn: {}
                     });
                 }
             });
         };

         return {
             constructor: publicConstructor,
             render: publicRender
         };
    };
});