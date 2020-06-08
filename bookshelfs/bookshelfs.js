"use strict";

const BookshelfsPostHandlers = require("./bookshelfsPostHandlers");
const BookshelfsEventHandlers = require("./bookshelfsEventHandlers");
const BookshelfsMenuHandlers = require("./bookshelfsMenuHandlers");
const BookshelfsViewHandlers = require("./bookshelfsViewHandlers");
const BookshelfsValidatorHandlers = require("./bookshelfsValidatorHandlers");

class BookshelfsStarter {
    async onStart(MantraAPI) {
        MantraAPI.Hooks("bookshelfs")
            .View([{
                Command: "wanttoreadlist",
                Handler: BookshelfsViewHandlers.WantToReadView,
                Js: "wanttoreadlist",
                AccessCondition: ["system.islogged"]
            }, {
                Command: "bookshelfslist",
                Handler: BookshelfsViewHandlers.BookshelfsListView,
                Js: "bookshelfslist",
                AccessCondition: [ "system.isloggedandredirectcurrent" ]
            }, {
                Command: "add",
                Handler: BookshelfsViewHandlers.AddBookshelf,
                AccessCondition: ["system.islogged"]
            }, {
                Command: "bookshelf",
                Handler: BookshelfsViewHandlers.Bookshelf,
                Js: "bookshelf",
                AccessCondition: ["system.islogged"]
            }])
            .Block([{
                BlockName: "wanttoread",
                Js: "wanttoread",
                AccessCondition: ["system.islogged"]
            },{
                BlockName:"addbooktobookshelf",
                Js: "addbooktobookshelf",
                AccessCondition: ["system.islogged"]
            }])
            .Post([{
                Command: "isinwanttoreadbookshelf",
                Handler: BookshelfsPostHandlers.IsInWantToReadBookshelf,
                AccessCondition: ["system.islogged"]
            }, {
                Command: "toggleuserinwanttoreadbookshelf",
                Handler: BookshelfsPostHandlers.ToggleUserInWantToReadBookshelf,
                AccessCondition: ["system.islogged"]
            }, {
                Command: "bookreadfromwanttoreadbookshelf",
                Handler: BookshelfsPostHandlers.BookReadFromWantToReadBookshelf,
                AccessCondition: ["system.islogged"]
            }, {
                Command: "removebookfrombookshelf",
                Handler: BookshelfsPostHandlers.RemoveBookFromBookshelf,
                AccessCondition: ["system.islogged"]
            }, {
                Command: "getbookscountinbookshelf",
                Handler: BookshelfsPostHandlers.GetBooksCountInBookshelf,
                AccessCondition: ["system.islogged"]
            }, {
                Command: "addbookshelf",
                Handler: BookshelfsPostHandlers.AddBookshelf,
                AccessCondition: ["system.islogged"]
            }, {
                Command: "removebookshelf",
                Handler: BookshelfsPostHandlers.RemoveBookshelf,
                AccessCondition: ["system.islogged"]
            }, {
                Command: "renderuserbookshelfs",
                Handler: BookshelfsPostHandlers.RenderUserBookshelfs,
                AccessCondition: ["system.islogged"]
            }, {
                Command: "addbookshelftouser",
                Handler: BookshelfsPostHandlers.AddBookshelfToUser,
                AccessCondition: ["system.islogged"]
            }])
            .Event([{
                EventName: "users.loggedin",
                EventHandler: BookshelfsEventHandlers.UserLoggedIn
            }, {
                EventName: "book.bookremoved",
                EventHandler: BookshelfsEventHandlers.BookRemoved
            }, {
                EventName: "users.removed",
                EventHandler: BookshelfsEventHandlers.OnUserRemoved
            }])
            .Menu([{
                MenuHandler: BookshelfsMenuHandlers.BookshelfsRegisterMenu,
                IsNotLoggedMenu: false,
                IsUserMenu: true,
                IsAdminMenu: false
            }])
            .Validator( [{
                Name: "bookshelf.noexists",
                Handler: BookshelfsValidatorHandlers.NoExists
            }]);
    }
}

class BookshelfsInstallation {
    async onInstall( MantraAPI ) {
        await MantraAPI.InstallSchema( "bookshelfs" );
    }

    async onUninstall( MantraAPI ) {
        await MantraAPI.UninstallSchema( "bookshelfs" );
    }
}

module.exports = () => {
    return { Start: new BookshelfsStarter(),
             Install: new BookshelfsInstallation() };
}