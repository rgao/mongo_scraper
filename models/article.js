const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var ArticleSchema = new Schema ({
    headline: {
        type: String,
        required: false
    },

    link: {
        type: String,
        required: false
    },

    thumbnail: {
        type: String,
        required: false
    },

    thread: {
        type: String,
        required: false
    }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;