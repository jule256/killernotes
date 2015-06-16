/* globals define:true, console:true */
define(
    [
        'jQuery',
        'handlebars'
    ], function($, handlebars) {

    'use strict';

    // configuration

    // module
   return function() {

        // handlebar settings

        var handlebarRegionId = 'region-reset';
        var handlebarTemplateId = 'template-reset';
        var handlebarSource = null;
        var handlebarTemplate = null;
        var handlebarContext = null;
        var handleBarHtml = null;

        // private functions

       /**
        *
        */
        var publicConstructor = function() {
            handlebarSource = $('#' + handlebarTemplateId).html();
            handlebarTemplate = handlebars.compile(handlebarSource);

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
        */
        var privatePostRender = function() {
            $('#reset').on('click', function() {
                $.event.trigger({
                    type: 'kn:reset',
                    kn: {},
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