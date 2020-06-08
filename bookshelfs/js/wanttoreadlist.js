$(document).ready( function() {
    $(".bookreadbutton").bind("click", onWantToReadButtonClick );
    $(".bookremovebutton").bind("click", onRemoveButtonClick );

    function onWantToReadButtonClick(e) {
        e.target.blur();
        let button = $(e.target);
        let bookId = button.attr("bookid");
        let bookshelfId = button.attr("bookshelfid");

        MantraAPI.Post("bookshelfs.bookreadfromwanttoreadbookshelf", { bookid: bookId },
            (r) => {
                let popupMessageOptions = {
                    title: "¡Libro leído!",
                    message: "Enhorabuena, ¿te gustó?. Ahora encontrarás este libro en tu estantería de libros leídos.",
                    onClose: bookRead,
                    onCloseParams: { bookshelfId: bookshelfId }
                }

                MantraAPI.PopupMessage.Show( popupMessageOptions );

                $("#"+bookId).fadeOut();
            });
    }

    function bookRead(data) {
        $("#"+data.bookId).fadeOut();

        checkIfAnyBookToRead(data.bookshelfId);
    }

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
                    MantraAPI.redirectTo("/bookshelfs/wanttoreadlist");
                }                    
            });
    }
});