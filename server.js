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

// Routes
// var routes = require("./routes.js");
// app.use(routes);

var db = require("./models");
var axios = require("axios");
var cheerio = require("cheerio");

var scraper = process.env.scraper || "mongodb://localhost/mongoHeadlines";
mongoose.connect(scraper);


app.get("/", function (request, response) {
    response.render("index");
});

app.get("/scrape", function (request, response) {
    var sub = request.body; 
    console.log(sub)

    axios.get("http://old.reddit.com/r/" + sub).then(function (data) {

        var $ = cheerio.load(data.data);

        var result = [];

        $(".thing").each(function (i, element) {
            var top_matter = $(element).children("div.entry").children("div.top-matter");

            var headline = top_matter.children("p.title").text();
            var link = top_matter.children("p.title").children().attr("href");
            var thumbnail = $(element).children("a.thumbnail").children().attr("src");
            var thread = top_matter.children("ul.buttons").children("li.first").children().attr("href");

            result.push({
                headline: headline,
                link: link,
                thumbnail: thumbnail,
                thread: thread
            });
        });

        // console.log(result);
        response.render("index", { article: result });
    });
});

app.post("/save", function (request, response) {
    db.Article.create(request.body)
        .then(function (dbArticle) {
            // console.log(dbArticle);
        });
});

app.get("/saved", function (request, response) {
    db.Article.find({})
        .then(function (dbArticles) {
            console.log(dbArticles)
            response.render("saved", { saved_articles: dbArticles });
        }).catch(function (error) {
            response.json(error);
        });
});

app.delete("/saved", function (request, response) {
    db.Article.remove({headline: request.body.headline});

    console.log(response);
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
