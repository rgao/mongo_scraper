$(document).on("click", "#scrape-btn", (event) => {
    event.preventDefault();

    var subreddit = $("#subreddit").val().trim();

    $.get("/scrape", subreddit, (data) => {
        console.log(data);
    })
});

$(document).on("click", ".save-btn", () => {
    // var id = $(this).attr("data-id");
    // console.log(id)
    console.log("grant's booty")
    $.ajax({
        type: "POST",
        url: "/save",
        data: {
            headline: $(this).attr(".data-headline"),
            link: $(this).attr(".data-link"),
            thumbnail: $(this).attr(".data-thumbnail"),
            thread: $(this).attr(".data-thread")
        }
    })
        .then(function (data) {
            console.log(data);
            $(this).text("Saved!");
        });
});

$(document).on("click", ".remove-btn", () => {

    $.ajax({
        type: "DELETE",
        url: "/article/delete",
        data: {
            headline: $(this).attr(".data-headline"),
            link: $(this).attr(".data-link"),
            thumbnail: $(this).attr(".data-thumbnail"),
            thread: $(this).attr(".data-thread"),
        }
    })
        .then(function (data) {
            console.log(data);
            $(this).text("Removed from saved articles.");
        });
});