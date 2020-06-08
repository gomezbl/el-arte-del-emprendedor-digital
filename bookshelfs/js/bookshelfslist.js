$(document).ready( function() {
    $(".bookshelfremovebutton").bind("click", onRemoveButtonClick );

    function onRemoveButtonClick(e) {
        let button = $(e.target);
        let bookshelfId = button.attr("bookshelfid");

        MantraAPI.Post("bookshelfs.removebookshelf", { bookshelfid: bookshelfId },
            () => {
                $("#"+bookshelfId).fadeOut();
            });
    }
});