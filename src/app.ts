import express from 'express';
import http from 'http';
import mongodb from 'mongodb';
import socketio from 'socket.io';
import _ from 'lodash';

import { Game } from './game';

// tynan
// HYpQY7egd3cjakg9

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const MongoClient = mongodb.MongoClient
const port = process.env.PORT || 8080;
const uri = 'mongodb+srv://tynan:HYpQY7egd3cjakg9@cluster0-cppcj.mongodb.net/test?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

let dbo;

app.listen(port);

server.listen(3000, () => {
	console.log('listening on *:3000');
});

app.use(express.json());
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Origin', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
// app.use(express.static('public'));

// db connection
client.connect((err, db) => {
	if(err) throw err;
	dbo = db.db('battleshots');
	dbo.createCollection('games', (_err, _res) => {
		if(_err) throw _err;
	});
});

io.on('connection', (socket) => {
	console.log('a user connected');
});

// READ Request Handlers
/*app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});*/

app.get('/games', (req, res) => {
	dbo.collection('games').find({}).toArray((err, games) => {
		if (err) throw err;
		res.send(games);
	});
});

app.post('/game', (req, res) => {
	const game: Game = new Game();
	dbo.collection('games').insertOne(game, (_err, _res) => {
		if (_err) throw _err;
		res.send(game);
	});
});

app.post('/game/:id', (req, res) => {
	const id: string = req.params.id;
	dbo.collection('games').findOneAndUpdate({id},
	{
		$setOnInsert: new Game(id)
	}, {
		returnOriginal: false,
		upsert: true
	}, (err, game) => {
		if(err) throw err;
		res.send(game.value);
	});
})

app.get('/game/:id', (req, res) => {
	dbo.collection('games').findOne({'_id': req.params.id}, (err, game) => {
		if (err) throw err;
		res.send(game);
	});
});

app.get('/game/:id/:row/:col', (req, res) => {
	const row = +req.params.row;
	const col = +req.params.col;
	dbo.collection('games').findOne({ '_id': req.params.id }, (err, game: Game) => {
		if (err) throw err;
		const g: Game = new Game(game._id, game.grid);
		console.log(`(${row}, ${col})`, g.guess(row, col));
		res.send(g.guess(row, col));
	});
});

/*app.get('/random', (req, res) => {
	const game = new Game();
	res.send(game.randomizePieces());
});*/
