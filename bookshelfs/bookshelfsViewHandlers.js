"use strict";

const _ = require("underscore");

const BookshelfsRepository = require("./bookshelfsRepository");
const BookshelfsConstants = require("./bookshelfsConstants");

module.exports = {
    WantToReadView: async (req, res ) => {
        let userId = res.MantraAPI.GetSecurityToken().userID;
        let bookshelfId = await BookshelfsRepository.GetBookshelfIdByName( res.MantraAPI, BookshelfsConstants.WANTTOREAD_BOOKSHELFNAME, userId );
        let books = await BookshelfsRepository.GetBooksByBookshelf( res.MantraAPI, bookshelfId );

        if ( books.length ) {
            let html = "";
    
            books = await res.MantraAPI.Invoke("date.formatbyproperty", { format:"F2",entities: books, property: "created" } );
            
            for( let book of books ) {
                book.bookInfo = await res.MantraAPI.Invoke("books.getbookinfobyid", book.bookid );
            }
                
            for( let book of books ) {           
                let data = {
                    coverurl: book.bookInfo.coversmallurl,
                    booktitle: book.bookInfo.title,
                    bookid: book.bookid,
                    bookshelfid: bookshelfId,
                    bookurl: `/book/${book.bookid}`,
                    authorurl: `/author/${book.bookInfo.userid}`,
                    created: book.created
                };

                let r = await res.MantraAPI.Invoke("authors.getauthorfullname", book.bookInfo.userid);
                data.bookauthor = r.fullname;

                html += await res.MantraAPI.RenderTemplate("bookshelfs/wanttoreadbookrow", data);
            }
    
            res.MantraAPI.AddRenderValue( "wanttoreadbookrows", html );
            res.MantraAPI.RenderView( "bookshelfs.wanttoreadlist" );
        } else {
            res.MantraAPI.RenderView( "bookshelfs.nobooksinbookshelf" );
        }
    },

    Bookshelf: async (req,res) => {
        let bookshelfId = req.query.q;
        let bookshelf = await BookshelfsRepository.GetBookshelfById( res.MantraAPI, bookshelfId );
        let books = await BookshelfsRepository.GetBooksByBookshelf( res.MantraAPI, bookshelfId );

        if ( books.length ) {
            let html = "";
    
            books = await res.MantraAPI.Invoke("date.formatbyproperty", { format:"F2",entities: books, property: "created" } );

            for( let book of books ) {
                // TODO: simplificar esta API para que obtenga solo del libro lo necesario
                book.bookInfo = await res.MantraAPI.Invoke("books.getbookinfobyid", book.bookid );
            }
            
            for( let book of books ) {
                let data = {
                    coverurl: book.bookInfo.coverurl,
                    booktitle: book.bookInfo.title,
                    bookid: book.bookid,
                    bookshelfid: bookshelfId,
                    bookurl: `/book/${book.bookid}`,
                    authorurl: `/author/${book.bookInfo.userid}`,
                    created: book.created
                };        

                let authorFullname = await res.MantraAPI.Invoke("authors.getauthorfullname", book.bookInfo.userid);
                data.bookauthor = authorFullname;

                html += await res.MantraAPI.RenderTemplate("bookshelfs/bookshelfbookrow", data);
            }
    
            res.MantraAPI.AddRenderValue( "bookshelfname", bookshelf.name );
            res.MantraAPI.AddRenderValue( "bookrows", html );
            res.MantraAPI.RenderView( "bookshelfs.bookshelf" );
        } else {
            res.MantraAPI.RenderView( "bookshelfs.nobooksinbookshelf" );
        }
    },

    BookshelfsListView: async (req, res) => {
        let userId = res.MantraAPI.GetSecurityToken().userID;
        let bookshelfs = await BookshelfsRepository.GetBookshelfsByUserId(res.MantraAPI, userId);

        if ( bookshelfs.length == 1 ) {
            res.MantraAPI.Invoke("messageview.showgeneralmessage", {
                headermessage: "Aún no has creado ninguna estantería",
                messagecontent: "Crea estanterías!!",
                subview: "bookshelfs.nobookshelfs"
            });
        } else {
            bookshelfs = _.sortBy(bookshelfs, "name");
            let html = "";            
    
            for (let bookshelf of bookshelfs) {
                if ( bookshelf.name != BookshelfsConstants.WANTTOREAD_BOOKSHELFNAME ) {
                    html += await res.MantraAPI.RenderTemplate("bookshelfs/bookshelfrow", 
                        { 
                            bookshelfid: bookshelf.ID, 
                            bookshelfname: bookshelf.name,
                            bookshelfurl: `/bookshelfs/bookshelf?q=${bookshelf.ID}`,
                            removebuttonvisible: bookshelf.name == BookshelfsConstants.WANTTOREAD_BOOKSHELFNAME ? "hidden" : "",
                            bookscount: await BookshelfsRepository.GetBooksCountInBookshelf( res.MantraAPI, bookshelf.ID)
                        });
                }
            }
    
            res.MantraAPI.AddRenderValue("bookshelfs", html);
            res.MantraAPI.RenderView("bookshelfs.bookshelfslist");
        }
    },

    AddBookshelf: async (req, res) => {
        let htmlForm = await res.MantraAPI.Invoke( "forms.NewForm", { Component: "bookshelfs", FormName: "addbookshelf" });

        res.MantraAPI.AddRenderValue( "form", htmlForm );
        res.MantraAPI.RenderView( "bookshelfs.addbookshelf" );
    }
}