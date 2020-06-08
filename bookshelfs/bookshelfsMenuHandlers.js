"use strict";

const BookshelfsConstants = require("./bookshelfsConstants");
const BookshelfsRepository = require("./bookshelfsRepository");

module.exports = {
    BookshelfsRegisterMenu: async function( MantraAPI ) {    
        if ( MantraAPI.GetSecurityToken().isLogged()  ) {
            let userId = MantraAPI.GetSecurityToken().userID;

            let wantToReadBsId = await BookshelfsRepository.GetBookshelfIdByName( MantraAPI, BookshelfsConstants.WANTTOREAD_BOOKSHELFNAME, userId );
            let wantToReadCount = await BookshelfsRepository.GetBooksCountInBookshelf( MantraAPI, wantToReadBsId );            
            let bookshelfsCount = await BookshelfsRepository.GetBookshelfsCountByUserId( MantraAPI, userId );

            return [
                {
                    href: "/bookshelfs/wanttoreadlist",
                    text: wantToReadCount ? `Lista de lectura <span class='badge badge-pill badge-info'>${wantToReadCount}</span>` : 'Lista de lectura',
                    icon: "fa-book",
                    weight: 800
                },
                {
                    href: "/bookshelfs/bookshelfslist",
                    text: `Estanterías <span class='badge badge-pill badge-info'>${bookshelfsCount-1}</span>`,
                    icon: "fa-book",
                    weight: 800
                }
            ]
        }
 
        return [];
    }    
}