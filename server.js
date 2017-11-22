// import the following
const express = require('express');
const morgan = require('morgan');

const app = express();

const blogpostsRouter = require('./blogpostsRouter');

// log the http layer
app.use(morgan('common'));

// when request come into `/blogposts`, we'll
// route them to the express router instances
// we have imported. Remember, these router 
// instances act as modular, mini-express apps.
app.use('/blog-posts', blogpostsRouter);

// both runServer and closeServer need to access the same
// server object, so we declare `server` here, and then when
// runServer runs, it assigns a value.
let Server;

// this function starts our server and returns a Promise.
// In our test code, we need a way of asynchronously starting 
// our server, since we'll be dealing with promises there.
function runServer() {
	const port = process.env.PORT || 8080;
	return new Promise((resolve, reject) => {
		server = app.listen(port, () => {
		console.log('Your app is listening on port ${port}');
		resolve(server);
	}).on('error', err => {
		reject(err)
	});
 });	
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
	return new Promise((resolve, reject) => {
		console.log('Closing server');
		server.close(err => {
			if (err) {
				reject(err);
				// so we don't also call `resolve()`
				return;
			}
			resolve();
		});
	});
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer comand so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
	runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};