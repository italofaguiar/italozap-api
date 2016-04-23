var express = require('express');
var UserModel = require('../models/user');
var jwt = require('jsonwebtoken');
var router = express.Router();

var JWT_SECRET = 'top-secret';

router.post('/', function (request, response) {
    var user = request.body.user;
    var password = request.body.password;

    UserModel.authUser(user, password, function (err, userId) {
        if (userId) {
            response.json({
                token: jwt.sign({}, JWT_SECRET, {subject: userId})
            });
        } else {
            response.sendStatus(401);
        }
    });
});

module.exports = router;