var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var PORT = 3000;

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var db = require("./models");
var axios = require("axios");
var cheerio = require("cheerio");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";
mongoose.connect(MONGODB_URI);

// renders all stored articles on home page
app.get("/", function (request, response) {
    db.Article.find({}).then((data) => {

        response.render("index", { article: data });
    });
});

// deletes all unsaved articles, scrape new articles, and render them
app.get("/scrape", function (request, response) {
    var sub = request.query.subreddit;
    db.Article.deleteMany({ "saved": false }).then(function (data) {

        axios.get("http://old.reddit.com/r/" + sub).then(function (data) {

            var $ = cheerio.load(data.data);
            var responseArray = [];
            $(".thing").each(function (i, element) {
                var result = {};
                var top_matter = $(element).children("div.entry").children("div.top-matter");

                result.headline = top_matter.children("p.title").text();
                result.link = top_matter.children("p.title").children().attr("href");
                result.thumbnail = $(element).children("a.thumbnail").children().attr("src");
                result.thread = top_matter.children("ul.buttons").children("li.first").children().attr("href");

                db.Article.create(result)
                    .then((dbArticle) => {
                        console.log(dbArticle);
                    }).catch((error) => {
                        console.log(error);
                    });
                responseArray.push(result)
            });
            console.log(responseArray)
            response.render("index", { article: responseArray });
        });
    })
});

// app.get("/articles/render", function (request, response) {
//     db.Article.find({})
//         .then(function (dbArticle) {
//             response.render("articles", { article: dbArticle });
//         })
//         .catch(function (error) {
//             response.json(error);
//         });
// });

// app.put("/save", function (request, response) {
//     console.log(request.query)
//     db.Article.update({ id: request.body._id },
//         { saved: true })
//         .then(function (dbArticle) {
//             console.log(dbArticle);
//         });
// });

// app.get("/saved", function (request, response) {
//     db.Article.find({})
//         .then(function (dbArticles) {
//             console.log(dbArticles)
//             response.render("saved", { saved_articles: dbArticles });
//         }).catch(function (error) {
//             response.json(error);
//         });
// });

// app.delete("/saved", function (request, response) {
//     db.Article.remove({ headline: request.body.headline });

//     console.log(response);
// });

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
