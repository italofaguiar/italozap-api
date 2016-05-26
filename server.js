var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cors = require('cors');
var bodyParser = require('body-parser');
var db = require('./config/mongodb');
var expressJwt = require('express-jwt');
var unless = require('express-unless');

app.set('etag', false);
app.use(bodyParser.json());
app.use(cors());

// TODO: acabar com essa redundancia do jwt_secret
var JWT_SECRET = 'top-secret';
app.use(expressJwt({secret: JWT_SECRET}).unless({path: ['/authenticate', '/authenticate/signup', '/']}));
app.use('/authenticate', require('./controllers/user'));
app.use('/rooms', require('./controllers/notes'));

app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var port = process.env.OPENSHIFT_NODEJS_PORT || 8300;

var mongodbUrl = '127.0.0.1:27017/notasitalo';

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    mongodbUrl = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" + process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/' + process.env.OPENSHIFT_APP_NAME;
}

console.log("conectando no mongo: " + mongodbUrl);

db.connect('mongodb://' + mongodbUrl, function (err) {
    if (err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1)
    } else {
        server.listen(port, ipaddress, function () {
            console.log('Notes API listening at: ' + ipaddress + ':' + port);
        });

        io.on('connection', function (socket) {

            var user = {};
            var roomId = {};

            function logOpenSockets() {
                console.log('\n------ Sockets abertos: -------')
                for (var hash in io.sockets.sockets) {
                    console.log('{ip: ' + io.sockets.sockets[hash].client.conn.remoteAddress + ', id: ' + io.sockets.sockets[hash].client.conn.id + '}');
                }
                console.log('---------------------------------\n')
            }

            console.log('+++++++ NOVA CONEXAO: {ip: ' + socket.client.conn.remoteAddress + ', id: ' + socket.client.conn.id + '}');

            logOpenSockets();
            
            socket.on('room entered', function (roomUser) {
                user = socket.user = roomUser.user;
                roomId = socket.roomId = roomUser.roomId;
                socket.join(roomId);
                socket.broadcast.to(roomId).emit('chat message',
                    {
                        text: "Usuario " + user + " entrou na sala..."
                    });

                console.log(user + ' entrou na sala ' + roomId);
            });

            socket.on('chat message', function (message) {
                io.to(roomId).emit('chat message', message);
                console.log(user + ' falou [' + message.text + '] na sala ' + roomId);
            });

            socket.on('disconnect', function () {
                io.to(roomId).emit('chat message',
                    {
                        text: "Usuario " + user + " deixou na sala..."
                    });
                console.log('-xxxx-  DISCONNECTING: {user: '+ user + ', ip: ' + socket.client.conn.remoteAddress + ', id: ' + socket.client.conn.id + '}');
                logOpenSockets();
            });

        });
    }
});
