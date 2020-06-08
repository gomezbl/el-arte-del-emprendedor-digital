$(document).ready( function() {
    let wantToReadButton = $("#wanttoreadbutton");

    wantToReadButton.bind("click", clickOnButton);

    updateWantToReadButton();

    function clickOnButton(e) {   
        wantToReadButton.blur();

        MantraAPI.Post("bookshelfs.toggleuserinwanttoreadbookshelf", { bookid: MantraAPI.data.bookid }, 
            () => {
                updateWantToReadButton();
            });
    }        

    function updateWantToReadButton() {
        MantraAPI.Post("bookshelfs.isinwanttoreadbookshelf", { bookid: MantraAPI.data.bookid },
            (r) => {
                let wantToReadButtonMessage = $("#wanttoreadmessagebutton");
                wantToReadButton.fadeIn();
                if ( r.isInWantToReadBookshelf ) {
                    wantToReadButtonMessage.html("Está en mi lista de lectura");
                } else {
                    wantToReadButtonMessage.html("Lo quiero leer");
                }
            });
    }
});