;(function() {
    'use strict';

    var http = require('http');
    var express = require('express');
    var bodyParser = require('body-parser');
    var notesRoutes = require('./routes/notesRoutes.js');

    var app = express();

    app.use(bodyParser.json());
    app.use('/notes', notesRoutes);

    app.use(express.static(__dirname + '/public'));

    //TODO: serverconfig with port, db, etc
    http.createServer(app).listen(3000);
    console.log('server started at localhost:3000');
})();