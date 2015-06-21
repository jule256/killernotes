/**
 * notesStore Module
 *
 * @author dominik.suesstrunk <dominik.suesstrunk@gmail.com>
 */
module.exports = function()
{
    'use strict';

    var datastore = require('nedb');
    var db = new datastore({ filename: './data/notes.db', autoload: true });

    /**
     * Get all notes from the database
     *
     * @author dominik.suesstrunk <dominik.suesstrunk@gmail.com>
     * @param {function} callback
     */
    var publicGetAllNotes = function(callback)
    {
        db.find({}, function(err, notes) {
            if (callback) {
                callback(err, notes);
            }
        });
    };

    /**
     *  add a note to the db
     *
     * @author dominik.suesstrunk <dominik.suesstrunk@gmail.com>
     * @param {string} title
     * @param {string} note
     * @param {string} duedate
     * @param {number} importance
     * @param {function} callback
     */
    var publicAddNote = function(title, note, duedate, importance, callback)
    {
        var newNote = {
            title: title,
            note: note,
            duedate: duedate,
            importance: importance,
            finished: false,
            createdate: Date.now().toString()
        };

        //var note = new Note(title, noteText, duedate, importance);
        db.insert(newNote, function(err, insertedNote) {
            if (callback) {
                callback(err, insertedNote);
            }
        });
    };

    /**
     * Get a note from the database by id
     *
     * @author dominik.suesstrunk <dominik.suesstrunk@gmail.com>
     * @param {string} id
     * @param {function} callback
     */
    var publicGetNote = function(id, callback)
    {
        db.findOne({ createdate: id }, function(err, note) {
            if (callback) {
                callback(err, note);
            }
        });
    };

    /**
     * Update a note in the database
     *
     * @author dominik.suesstrunk <dominik.suesstrunk@gmail.com>
     * @param {string} id
     * @param {string} title
     * @param {string} note
     * @param {string} duedate
     * @param {number} importance
     * @param {boolean} finished
     * @param {function} callback
     */
    var publicUpdateNote = function(id, title, note, duedate, importance, finished, callback) {
        var updateData = {
            title: title,
            note: note,
            duedate: duedate,
            importance: importance,
            finished: finished
        };

        db.update({ createdate: id },
            { $set: updateData }, function(err, count) {
                if (callback) {
                    callback(err, count);
                }
            });
    };

    /**
     *  delete a note from the db by its id
     *
     * @author dominik.suesstrunk <dominik.suesstrunk@gmail.com>
     * @param {string} id
     * @param {function} callback
     */
    var publicDelete = function(id, callback) {
        db.remove({ createdate: id }, {}, function(err, count) {
            if (callback) {
                callback(err, count);
            }
        });
    };

    /**
     * Deletes all notes from the database
     *
     * @param {function} callback
     */
    var publicDeleteAllNotes = function(callback) {
      db.remove({}, { multi: true }, function(err, count) {
          if(callback) {
              callback(err, count);
          }
      });
    };

    return {
        getNote: publicGetNote,
        addNote: publicAddNote,
        updateNote: publicUpdateNote,
        deleteNote: publicDelete,
        getAllNotes: publicGetAllNotes,
        deleteAllNotes: publicDeleteAllNotes
    };
}();