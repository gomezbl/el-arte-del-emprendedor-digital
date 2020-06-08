$(document).ready( function() {
    let addBookToBookshelfButton = $("#addbooktobookshelf");

    addBookToBookshelfButton.bind("click", clickOnButton);

    function clickOnButton(e) {   
        addBookToBookshelfButton.blur();

        MantraAPI.Post( "bookshelfs.renderuserbookshelfs", { bookId: MantraAPI.data.bookid },
            (r) => {
                $("#bookshelfsrows").html( r.html );
                setTimeout( bookshelfsLoaded(), 1);                            
            });

        $('#addbooktobookshelfmodal').modal({ show: true, backdrop: false, focus: true });
    } 

    function bookshelfsLoaded() {
        $(".bookshelftoselect").bind("click", function (e) {
            let bookshelfId = $(e.target).attr("bookshelfid");
            let data = { bookId: MantraAPI.data.bookid, bookshelfId: bookshelfId };

            MantraAPI.Post( "bookshelfs.addbookshelftouser", data,
                () => {
                    $('#addbooktobookshelfmodal').modal('hide');

                    let popupMessageOptions = {
                        title: "¡Añadido!",
                        message: "Se ha añadido el libro a tu estantería",
                    }
    
                    MantraAPI.PopupMessage.Show( popupMessageOptions );    
                });

            return false;
        });
    }
});