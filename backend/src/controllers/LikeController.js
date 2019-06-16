const Post = require('../models/Post');

module.exports = {

    //Criar
    async store(req, res) {
        const post = await Post.findById(req.params.id);
        post.likes += 1;

        await post.save();

        // Envia uma mensagem para o front-end chamada like
        req.io.emit('like', post);

        return res.json(post);
    }
};