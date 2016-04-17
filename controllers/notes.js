var express = require('express');
var NoteModel = require('../models/notes');
var router = express.Router();

router.get('/', function (request, response, next) {
    NoteModel.list(function (err, result) {
        response.json(result);
    });
});

router.get('/:noteId', function (request, response) {

    NoteModel.get(request.params.noteId, function (err, result) {
        if (result) {
            response.json(result);
        } else {
            response.status(404).send('No such note: ' + request.params.noteId);
        }
    });
});

router.post('/', function (request, response) {
    var noteId = NoteModel.addNew(request.body, function (err, result) {
        response.set('Location', '/' + noteId);
        response.status(201).send();
    })
});

router.put('/:noteId', function (request, response) {

    if (request.params.noteId !== request.body._id) {
        response.status(400).send('URL does not match request body');
    }
    NoteModel.update(request.body, function (err, result) {
        if (err) {
            response.status(404).send('No such note: ' + request.params.noteId);
        } else {
            response.status(204).send('Notes updated: ' + result.modifiedCount);
        }
    });
});

router.delete('/:noteId', function (request, response) {
    var noteId = request.params.noteId;

    if(noteId == 'all') {
        NoteModel.removeAll(function (err, result) {
            if (err) {
                response.status(404).send('Error in removing all notes');
            } else {
                response.status(204).send('Notes deleted: ' + result.deletedCount);
            }
        });
        return;
    }

    NoteModel.remove(noteId, function (err, result) {
        if (err) {
            response.status(404).send('No such note: ' + noteId);
        } else {
            response.status(204).send('Notes deleted: ' + result.deletedCount);
        }
    });
});

module.exports = router;
