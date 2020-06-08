"use strict";

const _ = require("underscore");

const BookshelfsRepository = require("./bookshelfsRepository");
const BookshelfsConstants = require("./bookshelfsConstants");

module.exports = {
    /*
     * Post bookshelfs.isinwanttoreadbookshelf
     * Checks if current book is in "wanttoread" bookshelf 
     * MantraPostData:
     * {
     *    bookid: <id of the book>
     * }
     */
    IsInWantToReadBookshelf: async (req, res) => {
        try {
            let userId = res.MantraAPI.GetSecurityToken().userID;
            let bookId = req.MantraPostData.bookid;
            let bsId = await BookshelfsRepository.GetBookshelfIdByName( res.MantraAPI, BookshelfsConstants.WANTTOREAD_BOOKSHELFNAME, userId );
            let isIn = await BookshelfsRepository.IsBookInBookshelf( res.MantraAPI, bsId, userId, bookId );
    
            res.MantraAPI.PostSuccess( { isInWantToReadBookshelf: isIn } );

        } catch(err) {
            await res.MantraAPI.LogError(err);
            res.MantraAPI.PostFailed( err.message );
        }
    },

    /*
     * Post bookshelfs.toggleuserinwanttoreadbookshelf
     * Called to change if book belongs to "wanttoread" list
     * MantraPostData:
     * {
     *    bookid: <id of the book>
     * }
     */
    ToggleUserInWantToReadBookshelf: async (req, res) => {
        try {
            let userId = res.MantraAPI.GetSecurityToken().userID;
            let bookId = req.MantraPostData.bookid;
            let bsId = await BookshelfsRepository.GetBookshelfIdByName( res.MantraAPI, BookshelfsConstants.WANTTOREAD_BOOKSHELFNAME, userId );
            let isIn = await BookshelfsRepository.IsBookInBookshelf( res.MantraAPI, bsId, userId, bookId );            

            if ( isIn ) {                
                await BookshelfsRepository.RemoveBookFromBookshelf( res.MantraAPI, bsId, userId, bookId );
            } else {
                await BookshelfsRepository.AddBookToBookshelf( res.MantraAPI, bsId, userId, bookId );
            }

            res.MantraAPI.PostSuccess();
        } catch(err) {
            await res.MantraAPI.LogError(err);
            res.MantraAPI.PostFailed( err.message );
        }
    },

    /*
     * Post bookshelfs.bookreadfromwanttoreadbookshelf
     * Removes a book from "wanttoread" list and adds it to "read" list
     * MantraPostData:
     * {
     *   bookid: <id of the book> 
     * }
     */
    BookReadFromWantToReadBookshelf: async (req, res) => {
        try {
            let userId = res.MantraAPI.GetSecurityToken().userID;
            let bookId = req.MantraPostData.bookid;
            let bookshelfId = await BookshelfsRepository.GetBookshelfIdByName( res.MantraAPI, BookshelfsConstants.WANTTOREAD_BOOKSHELFNAME, userId );
                     
            await BookshelfsRepository.RemoveBookFromBookshelf( res.MantraAPI, bookshelfId, userId, bookId );
         
            // Add book to "read" bookshelf
            await BookshelfsRepository.CreateBookshelfIfNotExists( res.MantraAPI, BookshelfsConstants.BOOKSREAD_BOOKSHELFNAME, userId );
            let readBookshelfId = await BookshelfsRepository.GetBookshelfIdByName( res.MantraAPI, BookshelfsConstants.BOOKSREAD_BOOKSHELFNAME, userId );

            let isBookInBookshelf = await BookshelfsRepository.IsBookInBookshelf( res.MantraAPI, readBookshelfId, userId, bookId );

            if ( !isBookInBookshelf ) {
                await BookshelfsRepository.AddBookToBookshelf( res.MantraAPI, readBookshelfId, userId, bookId );
            }

            res.MantraAPI.PostSuccess();
        } catch(err) {
            await res.MantraAPI.LogError(err);
            res.MantraAPI.PostFailed( err.message );
        }
    },

    /*
     * Post bookshelfs.RemoveBookFromBookshelf
     * Removes a book from "wanttoread" list
     * MantraPostData:
     * {
     *   bookid: <id of the book>,
     *   bookshelfid: <id of the bookshelf>
     * }
     */
    RemoveBookFromBookshelf: async (req, res) => {
        try {
            let userId = res.MantraAPI.GetSecurityToken().userID;
            let bookId = req.MantraPostData.bookid;
            let bookshelfId = req.MantraPostData.bookshelfid;
         
            await BookshelfsRepository.RemoveBookFromBookshelf( res.MantraAPI, bookshelfId, userId, bookId );
         
            res.MantraAPI.PostSuccess();
        } catch(err) {
            await res.MantraAPI.LogError(err);
            res.MantraAPI.PostFailed( err.message );
        }
    },

    /*
     * Post bookshelfs.getbookscountinbookshelf
     * Returns the number of book in a bookshelf
     * {
     *   bookshelfid: <id of the bookshelf>
     * }
     */
    GetBooksCountInBookshelf: async (req,res) => {
        try {
            let bookshelfId = req.MantraPostData.bookshelfid;
            let count = await BookshelfsRepository.GetBooksCountInBookshelf( res.MantraAPI, bookshelfId );
         
            res.MantraAPI.PostSuccess( { booksCount:count} );
        } catch(err) {
            await res.MantraAPI.LogError(err);
            res.MantraAPI.PostFailed( err.message );
        }
    },

    /*
     * Post bookshelfs.addbookshelf
     * Adds a new bookshelf
     * MantraPostData: 
     * {
     *    bookshelfname: <name of the new bookshelf>
     * }
     */
    AddBookshelf: async (req,res) => {
        let userId = res.MantraAPI.GetSecurityToken().userID;
        await BookshelfsRepository.CreateBookshelfIfNotExists( res.MantraAPI, req.MantraPostData.bookshelfname, userId );

        res.MantraAPI.PostSuccess( { validated : true } );
    },

    /*
     * Post bookshelfs.removebookshelf
     * Removes a bookshelf
     * MantraPostData:
     * {
     *    bookshelfid: <id of the bookshelf to remove>
     * }
     */
    RemoveBookshelf: async(req,res) => {
        await BookshelfsRepository.RemoveBookshelf( res.MantraAPI, req.MantraPostData.bookshelfid );

        res.MantraAPI.PostSuccess();
    },

    /*
     * Post bookshelfs.renderuserbookshelfs
     * Returns list of user bookshelfs rendered in a table
     * MantraPostData:
     * {
     *    bookId: <id of the book to add>
     * }
     */
    RenderUserBookshelfs: async(req,res) => {
        let userId = res.MantraAPI.GetSecurityToken().userID;
        let bookshelfs = await BookshelfsRepository.GetBookshelfsByUserId( res.MantraAPI, userId );
        let html = "";
        bookshelfs = _.sortBy( bookshelfs, "name" );

        if ( bookshelfs.length > 1 ) {
            html = "<p>Elige la estantería a la que quieres añadir el libro</p>";

            for (let bookshelf of bookshelfs) {
                if ( bookshelf.name != BookshelfsConstants.WANTTOREAD_BOOKSHELFNAME ) {
                    html += await res.MantraAPI.RenderTemplate("bookshelfs/bookshelfrowtoselect", 
                    { 
                        bookshelfid: bookshelf.ID, 
                        bookshelfname: bookshelf.name
                    });
                }
            }
        } else {
            html = "Aún no has creado estanterías. Dirígete a <a href='/bookshelfs/bookshelfslist'>tus estanterías</a> para crearlas."
        }

        res.MantraAPI.PostSuccess( { html: html } );
    },

    /*
     * Post bookshelfs.addbookshelftouser
     * Adds a book to a bookshelfs
     * MantraPostData: 
     * {
     *    bookId: <id of the book to add>,
     *    bookshelfId: <id of the bookshelf>
     * }
     */
    AddBookshelfToUser: async (req,res) => {
        let userId = res.MantraAPI.GetSecurityToken().userID;
        let bookshelfId = req.MantraPostData.bookshelfId;
        let bookId = req.MantraPostData.bookId;

        let isBookInBookshelf = await BookshelfsRepository.IsBookInBookshelf( res.MantraAPI, bookshelfId, userId, bookId );

        if ( !isBookInBookshelf ) {
            await BookshelfsRepository.AddBookToBookshelf( res.MantraAPI, bookshelfId, userId, bookId );
        }

        res.MantraAPI.PostSuccess();
    }
}