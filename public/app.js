$(document).on("click", "#scrape-btn", (event) => {
    event.preventDefault();

    if ($("#subreddit").val().trim() === "") {
        var subreddit = "politics"
        scrape(subreddit);
    } else {
        var subreddit = scrape($("#subreddit").val().trim() === "");
        scrape(subreddit);
    };
});

function scrape(input) {
    $.ajax({
        type: "GET",
        url: "/scrape",
        data: {subreddit: input} 
    }).then((data) => {
        console.log(data);
    });
};

// $(document).on("click", ".save-btn", () => {

//     $.ajax({
//         type: "POST",
//         url: "/save",
//         data: {
//             headline: $(this).attr(".data-headline"),
//             link: $(this).attr(".data-link"),
//             thumbnail: $(this).attr(".data-thumbnail"),
//             thread: $(this).attr(".data-thread")
//         }
//     })
//         .then(function (data) {
//             console.log(data);
//             $(this).text("Saved!");
//         });
// });

// $(document).on("click", ".remove-btn", () => {

//     $.ajax({
//         type: "DELETE",
//         url: "/article/delete",
//         data: {
//             headline: $(this).attr(".data-headline"),
//             link: $(this).attr(".data-link"),
//             thumbnail: $(this).attr(".data-thumbnail"),
//             thread: $(this).attr(".data-thread"),
//         }
//     })
//         .then(function (data) {
//             console.log(data);
//             $(this).text("Removed from saved articles.");
//         });
// });