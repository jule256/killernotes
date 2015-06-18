/**
 * notesController Module
 *
 * @author dominik.suesstrunk <dominik.suesstrunk@gmail.com>
 */
module.exports = function() {
    'use strict';

    var crypto = require('crypto');
    var store = require('../services/notesStore.js');

    /**
     * Gets all notes from the the database and sends them back
     *
     * @author dominik.suesstrunk <dominik.suesstrunk@gmail.com>
     * @param {object} req
     * @param {object} res
     */
    var publicGetAllNotes = function(req, res) {
        store.getAllNotes(function(err, notes) {
            res.send(notes);
        });
    };

    /**
     * Gets a note by its id and sends it back
     *
     * @author dominik.suesstrunk <dominik.suesstrunk@gmail.com>
     * @param {object} req
     * @param {object} res
     */
    var publicGetNote = function(req, res) {
        var id = req.params.id;

        store.getNote(id, function(err, note) {
            if (note) {
                res.send(note);
            } else {
                res.status(404);
                res.send('Note ' + id + ' not found');
            }
        });
    };

    /**
     * Adds a new note and sends the new note back
     *
     *
     * @author dominik.suesstrunk <dominik.suesstrunk@gmail.com>
     * @param {object} req
     * @param {object} res
     */
    var publicAddNote = function(req, res) {
        var title = req.body.title;
        var note = req.body.note;
        var duedate = req.body.duedate;
        var importance = req.body.importance;

        store.addNote(title, note, duedate, importance, function(err, newNote) {
            res.send(newNote);
        });
    };

    /**
     * Updates the note and sends back the updated note or responds with 404
     *
     * @author dominik.suesstrunk <dominik.suesstrunk@gmail.com>
     * @param {object} req
     * @param {object} res
     */
    var publicUpdateNote = function(req, res) {
        var id = req.params.id;
        var title = req.body.title;
        var note = req.body.note;
        var duedate = req.body.duedate;
        var importance = req.body.importance;
        var finished = req.body.finished;

        store.updateNote(id, title, note, duedate, importance, finished, function(err, count) {
            if (count > 0) {
                store.getNote(id, function(err, note) {
                    res.send(note);
                });
            } else {
                res.status(404);
                res.send('Note ' + id + ' not found');
            }
        });
    };

    /**
     * Deletes a note from the db and sends back the number of deleted notes (should be 1)
     *
     * @author dominik.suesstrunk <dominik.suesstrunk@gmail.com>
     * @param {object} req
     * @param {object} res
     */
    var publicDeleteNote = function(req, res) {
        var id = req.params.id;

        store.deleteNote(id, function(err, count) {
            if (count === 0) {
                res.status(404);
                res.send('Note ' + id + ' not found');
            }
        });
    };

    /**
     * Get the current hash/state of the all notes
     * Needed for syncing
     *
     * @author dominik.suesstrunk <dominik.suesstrunk@gmail.com>
     * @param {object} req
     * @param {object} res
     */
    var publicGetState = function(req, res) {
        store.getAllNotes(function(err, notes) {
            var allNotesString,
                md5Sum,
                md5Hash;

            allNotesString = JSON.stringify(notes);
            md5Sum = crypto.createHash('md5');
            md5Sum.update(allNotesString);
            md5Hash = md5Sum.digest('hex');

            res.send(md5Hash);
        });
    };

    return {
        getNote: publicGetNote,
        addNote: publicAddNote,
        updateNote: publicUpdateNote,
        deleteNote: publicDeleteNote,
        getAllNotes: publicGetAllNotes,
        getState: publicGetState
    };
}();