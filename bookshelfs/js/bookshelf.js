$(document).ready( function() {
    $(".bookremovebutton").bind("click", onRemoveButtonClick );

    function onRemoveButtonClick(e) {
        let button = $(e.target);
        let bookId = button.attr("bookid");
        let bookshelfId = button.attr("bookshelfid");

        MantraAPI.Post("bookshelfs.removebookfrombookshelf", { bookid: bookId, bookshelfid: bookshelfId },
            (r) => {
                $("#"+bookId).fadeOut();
                checkIfAnyBookToRead(bookshelfId);
            });
    }

    function checkIfAnyBookToRead(bookshelfId) {
        MantraAPI.Post("bookshelfs.getbookscountinbookshelf", { bookshelfid: bookshelfId },
            (r) => {
                if (r.booksCount == 0) {
                    MantraAPI.redirectTo("/bookshelfs/bookshelf?q="+bookshelfId);
                }                    
            });
    }
});