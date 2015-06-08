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
    ], function ($, handlebars, App) {

    'use strict';

    var Killernotes = new App();
    Killernotes.start();


    /*
    var module1 = new module1ref(),
        module2 = new module2ref();
    console.log(module1.getName() === module2.getModule1Name());
    /**/
    console.info(
        'jQuery version: ' + $.fn.jquery + ', ' +
        'Handlebars version: ' + handlebars.VERSION + ', ' +
        'Killernotes version: ' + Killernotes.getVersion()
    );

});