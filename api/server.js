const express = require('express');
const server = express();
const postsRouter = require('./posts/posts-router');

server.use(express.json());
server.use('/api/posts', postsRouter);

server.get('/', (req, res) => {
    res.send(`
    <h2>Post it Thing</h2>
    <p>This is my post/reply server</p>
    `);
});

module.exports = server;