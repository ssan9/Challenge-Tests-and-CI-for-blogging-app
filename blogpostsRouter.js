// import the following
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {BlogPosts} = require('./models');


// we're going to add some posts to BlogPost
// so there's some data to look at
BlogPosts.create('Life of a Web Developer', 'Challenges faced by a Developer', 'Swati Saluja', '07/11/2017');
BlogPosts.create('I, Me and Web Development', 'My love for Web Development', 'Benjamin Button', '08/11/2017');
BlogPosts.create('The road that leads to Web Development', 'How to be a Web Developer', 'Pinocchio', '09/11/2017');

// when the root of this router is called with GET, return
// all current BlogPost posts with JSON representation
router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});

// when new blogpost added, ensure it has required fields, If not,
// log error and return 400 status code with helpful message.
// if okay, add new posts, and return it with a status 201.
router.post('/', jsonParser, (req, res) => {
	// ensure 'title', 'content', 'author', and 'publishDate' are 
	// in request body
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body` 
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const post = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
	res.status(201).json(post);
}); 

// Delete blogpost (by id)!
router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blogpost post \`${req.params.ID}\``);
	res.status(204).end();
});

// when PUT request comes in with updated blogpost, ensure it has 
// required fields. Also ensure that blogpost id in url path, and 
// blogpost id in updated post object match. If problems with any
// of that, log error and send back status code 400. Otherwise 
// call `BlogPosts.updatePost` with updated blogpost.
router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate', 'id'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if(!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if (req.params.id !== req.body.id){
		const message = (
			`Request path id (${req.params.id}) and request body id`
			`(${req.body.id}) must match`);
		console.error(message);
		return res.status(400).send(message);
	}
	console.log(`Updating blogpost \`{req.params.id}\'`);
	const updatedPost =BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	});
	res.status(204).end();
})

module.exports = router;

