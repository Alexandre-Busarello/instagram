const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
	author: String,
	place: String,
	description: String,
	hashtags: String,
	image: String,
	likes: {
		type: Number,
		default: 0,
	},
}, {
	// Cria no registro do mongo dois campos, o Created At e o Updated At
	timestamps: true,
});

module.exports = mongoose.model('Post', PostSchema);
