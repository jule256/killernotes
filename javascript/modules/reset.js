/* globals define:true, console:true */
define(
    [
        'jQuery',
        'handlebars'
    ], function ($, handlebars) {

    'use strict';

    // configuration

    // module
    var returnedReset = function () {

        // handlebar settings

        var handlebarRegionId = 'region-reset';
        var handlebarTemplateId = 'template-reset';
        var handlebarSource = null;
        var handlebarTemplate = null;
        var handlebarContext = null;
        var handleBarHtml = null;

        // private functions

        this.constructor = function() {

        };

        this.preRender = function() {
            handlebarSource = $('#' + handlebarTemplateId).html();
            handlebarTemplate = handlebars.compile(handlebarSource);
            handlebarContext = {
                title: 'reset'
            };
            handleBarHtml = handlebarTemplate(handlebarContext);
        };

        this.render = function() {
            this.preRender();

            $('#' + handlebarRegionId).html(handleBarHtml);

            this.postRender();
        };

        this.postRender = function() {
            $('#reset').on('click', function(ev) {
                $.event.trigger({
                    type: 'kn:reset',
                    kn: {},
                    time: new Date()
                });
            });
        };
    };

    return returnedReset;

});