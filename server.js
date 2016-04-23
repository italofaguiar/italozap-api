var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var db = require('./config/mongodb');
var expressJwt = require('express-jwt');
var unless = require('express-unless');

var app = express();

app.set('etag', false);
app.use(bodyParser.json());

// TODO: acabar com essa redundancia do jwt_secret
var JWT_SECRET = 'top-secret';
app.use(expressJwt({secret: JWT_SECRET}).unless({path: ['/authenticate', '/authenticate/signup']}));
app.use('/authenticate', require('./controllers/user'));
app.use('/notes', require('./controllers/notes'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
//var ipaddress = '192.168.0.20';

var port      = process.env.OPENSHIFT_NODEJS_PORT || 8300;

//var mongodbUrl = 'mongodb://italofaguiar:123456@ds017070.mlab.com:17070/notasitalo';

var mongodbUrl = '127.0.0.1:27017/notasitalo';

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    mongodbUrl = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

console.log("conectando no mongo: " + mongodbUrl);

db.connect('mongodb://' + mongodbUrl, function (err) {
    if (err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1)
    } else {
        app.listen(port, ipaddress, function () {
            console.log('Notes API listening at: ' + ipaddress + ':' + port);
        });
    }
});
