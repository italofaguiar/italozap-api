var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var db = require('./config/mongodb')
var app = express();

app.set('etag', false);
app.use(bodyParser.json());

var corsOptions = {
    origin: 'https://notas-italo-backend.herokuapp.com/notes/'
};
app.use(cors(corsOptions));
//app.use(function(req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//    next();
//});

app.use('/notes', require('./controllers/notes'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// var port = Number(process.env.PORT || 8200);

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8200;

var mongodbUrl = 'mongodb://italofaguiar:123456@ds017070.mlab.com:17070/notasitalo';

db.connect(mongodbUrl, function (err) {
    if (err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1)
    } else {
        app.listen(port, ipaddress, function () {
            console.log('Notes API listening at: ' + ipaddress + ':' + port);
        });
    }
});
