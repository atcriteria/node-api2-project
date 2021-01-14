const Posts = require('../db-helpers');
const express = require('express');

const router = express.Router();

// endpoints go below this

// make a post
router.post('/', (req, res) => {
    const newPost = req.body;
    Posts.insert(newPost)
        .then(post => {
            if (post){
                res.status(201).json(post); // '.returning() is not supported by sqlite3 and will not have any effect.' error in console, returns only the post id but creates the post.
            } else {
                res.status(400).json({errorMessage: "Please provide title and contents for the post."})
            }
        })
        .catch(err => {
            res.status(500).json({error: "There was an error while saving the post to the database"})
        })
})

// make a comment
// doesn't currently work, unable to tell the format of how it wants this stuff. There's nothing in the Readme. oh well
router.post('/:id/comments', (req, res) => {
    const newComment = req.body;
    console.log(newComment)
    Posts.insertComment(newComment)
        .then(comment => {
            if(comment){
                res.status(201).json(comment)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist."})
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Internal server error"})
        })
})

// get all posts
router.get('/', (req, res) => {
    Posts.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
});

// get post by ID
router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ error: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
});

// get comments by post id
router.get('/:id/comments', (req, res) => {
    Posts.findCommentById(req.params.id)
        .then(comment => {
            if (comment){
                res.status(200).json(comment)
            } else {
                res.status(404).json({ error: "The comment with the specified ID does not exist" })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The comment information could not be retrieved" })
        })
})

// Updates the post with the specified `id` using data from the `request body`. Returns the modified document
router.put('/:id', (req, res) => {
    const changes = req.body;
    if (!changes.title || !changes.contents) {
        res.status(404).json({ message: "You must include a title and contents to update the post." })
    }
    Posts.update(req.params.id, changes)
        .then(post => {
            if (post){
                res.status(200).json({ message: "The post has been successfully updated!" }) // its returning the post id for some reason...
            } else {
                res.status(404).json({ message: "Unable to locate post with given ID" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "Error updating the post" })
        })
})

router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json({message: "Successfully deleted"})
            } else {
                res.status(404).json({message: "Unable to find that post"})
            }
        })
        .catch(err => {
            res.status(500).json({message: "You must specify a correct post id" })
        })
})


module.exports = router;