const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');
const PostController = require('./controllers/PostController');
const LikeController = require('./controllers/LikeController');

const routers = new express.Router();
const upload = multer(uploadConfig);

routers.get('/posts', PostController.index);
routers.post('/posts', upload.single('image'), PostController.store);

routers.post('/posts/:id/like', LikeController.store);

module.exports = routers;