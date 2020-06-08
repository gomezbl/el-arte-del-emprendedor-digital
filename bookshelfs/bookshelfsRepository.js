"use strict";

module.exports = {
    CreateBookshelfIfNotExists: async (MantraAPI, bookshelfName, userId ) => {
        let db = MantraAPI.ComponentEntities("bookshelfs");
        let exists = await db.bookshelfs.S().W("name=? and userid=?", [bookshelfName, userId]).Exists();

        if ( !exists ) {
            await db.bookshelfs.I().V( { name: bookshelfName, userid: userId }).R();
        }
    },

    ExistsBookshelfByNameAndUserId: async (MantraAPI, bookshelfName, userId ) => {
        let db = MantraAPI.ComponentEntities("bookshelfs");
    
        return db.bookshelfs.S().W("name=? and userid=?", [bookshelfName, userId]).Exists();
    },
    
    IsBookInBookshelf: async (MantraAPI, bookshelfId, userId, bookId) => {
        let db = MantraAPI.ComponentEntities("bookshelfs");
       
        return db.bookshelfbooks.S().W("bookshelfid=? and userid=? and bookid=?", [bookshelfId, userId, bookId]).Exists();
    },

    GetBookshelfIdByName: async (MantraAPI, bookshelfname, userId ) => {
        let db = MantraAPI.ComponentEntities("bookshelfs");
        let bs = await db.bookshelfs.S().W("name=? and userid=?", [bookshelfname, userId]).Single();

        return bs.ID;
    },

    GetBookshelfById: async (MantraAPI, bookshelfId ) => {
        let db = MantraAPI.ComponentEntities("bookshelfs");
        return db.bookshelfs.S().W("ID=?", bookshelfId).Single();
    },

    GetBookshelfsByUserId: async (MantraAPI, userId) => {
        let db = MantraAPI.ComponentEntities("bookshelfs");
        return db.bookshelfs.S().W("userid=?", userId).R();
    },

    AddBookToBookshelf: async (MantraAPI, bookshelfId, userId, bookId ) => {
        let db = MantraAPI.ComponentEntities("bookshelfs");

        return db.bookshelfbooks.I().V( { bookshelfid: bookshelfId, userid: userId, bookid: bookId } ).R();
    },

    RemoveBookFromBookshelf: async (MantraAPI, bookshelfId, userId, bookId ) => {
        let db = MantraAPI.ComponentEntities("bookshelfs");

        return db.bookshelfbooks.D().W("bookshelfid=? and userid=? and bookid=?", [bookshelfId, userId, bookId ]).R();
    },

    GetBooksByBookshelf: async ( MantraAPI, bookshelfId ) => {
        let db = MantraAPI.ComponentEntities("bookshelfs");

        return db.bookshelfbooks.S().W("bookshelfid=?", bookshelfId).R();
    },

    GetBooksCountInBookshelf: async (MantraAPI, bookshelfId ) => {
        let db = MantraAPI.ComponentEntities("bookshelfs");

        return db.bookshelfbooks.S().W("bookshelfid=?", bookshelfId).Count();
    }, 

    RemoveBookshelf: async (MantraAPI, bookshelfId ) => {
        let db = MantraAPI.ComponentEntities("bookshelfs");

        await db.bookshelfbooks.D().W("bookshelfid=?",bookshelfId).R();
        await db.bookshelfs.D().DeleteById(bookshelfId);
    },

    GetBookshelfsCountByUserId: async (MantraAPI, userId ) => {
        let db = MantraAPI.ComponentEntities("bookshelfs");

        return db.bookshelfs.S().W("userid=?", userId).Count();
    },

    RemoveBookFromBookShelfsByBookId: async ( MantraAPI, bookId ) => {
        let db = MantraAPI.ComponentEntities("bookshelfs");

        return db.bookshelfbooks.D().W("bookid=?",bookId).R();
    },

    RemoveBookshelfsByUserId: async ( MantraAPI, userId ) => {
        let db = MantraAPI.ComponentEntities("bookshelfs");

        let userBookshelfs = await db.bookshelfs.S().W("userid=?",userId).R();

        for( let userBookshelf of userBookshelfs ) {
            await db.bookshelfbooks.D().DeleteById(userBookshelf.ID);
        }
        
        return db.bookshelfs.D().W("userid=?",userId).R();
    }
}