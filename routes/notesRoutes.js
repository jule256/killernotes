/**
 * notesRoutes Module
 *
 * @author dominik.suesstrunk <dominik.suesstrunk@gmail.com>
 */
module.exports = (function() {
    'use strict';

    // register the routes for all note-operations
    var notes = require('../Controllers/notesController.js');
    var express = require('express');
    var router = express.Router();

    router.get('/', notes.getAllNotes);
    router.post('/', notes.addNote);
    router.get('/state', notes.getState);
    router.get('/:id/', notes.getNote);
    router.put('/:id', notes.updateNote);
    router.delete('/:id/', notes.deleteNote);

    return router;
})();