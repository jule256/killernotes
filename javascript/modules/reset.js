/* globals define:true, console:true */
define(
    [
        'jQuery',
        'handlebars'
    ], function ($, handlebars) {

    'use strict';

    // configuration

    // module
   return function () {

        // handlebar settings

        var handlebarRegionId = 'region-reset';
        var handlebarTemplateId = 'template-reset';
        var handlebarSource = null;
        var handlebarTemplate = null;
        var handlebarContext = null;
        var handleBarHtml = null;

        // private functions

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
                title: 'reset'
            };
            handleBarHtml = handlebarTemplate(handlebarContext);
        };

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