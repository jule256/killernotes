/**
 *
 * @author dominik.suesstrunk <dominik.suesstrunk@gmail.com>
 */
;(function() {
    'use strict';

    var server;

    var http = require('http');
    var express = require('express');
    var config = require('./config.js');
    var bodyParser = require('body-parser');
    var notesRoutes = require('./routes/notesRoutes.js');

    var app = express();

    app.use(bodyParser.json());

    app.use('/notes', notesRoutes);

    app.use(express.static(__dirname + '/public'));

    server = http.createServer(app);
    server.listen(config.port);

    console.log('server started at localhost:' + config.port);
})();