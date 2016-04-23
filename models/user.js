var db = require('../config/mongodb');

exports.authUser = function (user, password, callback) {
    var notes = db.get().collection('user');

    notes.find({"user": user, "password": password}).toArray(function (err, users) {
        var userId;
        if(users[0]) {
            userId = users[0]._id;
        }
        callback(err, userId);
    });
};

