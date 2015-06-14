/* global require:true, console:true */
require.config({
    paths: {
        'jQuery': '../vendor/jquery/jquery-2.1.4',
//      'jQuery': 'vendor/jquery/jquery-2.1.4.min',
        'handlebars': '../vendor/handlebars/handlebars-v3.0.3'
    },
    shim: {
        'jQuery': {
            exports: '$'
        },
        'handlebars': {
            exports: 'handlebars'
        }
    }
});
require(
    [
        'jQuery',
        'handlebars',
        'app'
    ], function($, handlebars, App) {

    'use strict';

    var Killernotes = new App();
    Killernotes.start();

    console.info(
        'jQuery version: ' + $.fn.jquery + ', ' +
        'Handlebars version: ' + handlebars.VERSION + ', ' +
        'Killernotes version: ' + Killernotes.getVersion()
    );

});