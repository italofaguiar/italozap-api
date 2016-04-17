//var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var db = require('../config/mongodb');

exports.list = function (callback) {
    var notes = db.get().collection('notes');

    notes.find().toArray(function (err, result) {
            callback(err, result);
        },
        function (err) {
            callback(err);
        }
    );
};

exports.get = function (id, callback) {
    var notes = db.get().collection('notes');

    notes.find({"_id": ObjectId(id)}).toArray(function (err, result) {
        callback(err, result);
    });
};

exports.addNew = function (note, callback) {
    var notes = db.get().collection('notes');

    notes.insertOne({
        "title": note.title,
        description: note.description
    }, function (err, result) {
        callback(err, result);
    });
};

exports.update = function (note, callback) {
    var notes = db.get().collection('notes');


    notes.updateOne({"_id": ObjectId(note._id)},
        {$set: {"title": note.title, "description": note.description}},
        function (err, result) {
            callback(err, result);
        });
};

exports.remove = function (noteId, callback) {

    var notes = db.get().collection('notes');

    notes.deleteOne({"_id": ObjectId(noteId)},
        function (err, result) {
            callback(err, result);
        });
};

exports.removeAll = function (callback) {
    var notes = db.get().collection('notes');

    notes.deleteMany({},
        function (err, result) {
            callback(err, result);
        });
};

