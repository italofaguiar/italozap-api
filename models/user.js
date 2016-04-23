var db = require('../config/mongodb');

exports.authUser = function (user, password, callback) {
    var users = db.get().collection('user');

    users.find({"user": user, "password": password}).toArray(function (err, users) {
        var userId;
        if(users[0]) {
            userId = users[0]._id;
        }
        callback(err, userId);
    });
};

exports.create = function (user, password, callback) {
    var users = db.get().collection('user');

    users.insertOne({"user": user, "password": password}, function (err, result) {
        var userId;
        if(result) {
            userId = result.insertedId;
        }
        callback(err, userId);
    });
};

