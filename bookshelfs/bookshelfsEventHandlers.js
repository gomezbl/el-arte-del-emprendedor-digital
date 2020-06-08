"use strict";

const BookshelfsRepository = require("./bookshelfsRepository");
const BookshelfsConstants = require("./bookshelfsConstants");

module.exports = {
    /*
     * Event handler "users.loggedin"
     * Check if bookshelf "want to read" is created for user; if not, then creates it
     */
    UserLoggedIn: async (eventData) => {
        return BookshelfsRepository.CreateBookshelfIfNotExists( eventData.MantraAPI, BookshelfsConstants.WANTTOREAD_BOOKSHELFNAME, eventData.userID );
    },

    BookRemoved: async (eventData) => {
        let bookId = eventData.bookEntity.ID;

        return BookshelfsRepository.RemoveBookFromBookShelfsByBookId( eventData.MantraAPI, bookId );
    },

    OnUserRemoved: async (eventData) => {
        return BookshelfsRepository.RemoveBookshelfsByUserId( eventData.MantraAPI, eventData.userId );
    }
}