"use strict";

const ArticlesApiHandlers = require("./articlesApiHandlers");
const ArticlesBlockHandlers = require("./articlesBlockHandlers");
const ArticlesMenuHandlers = require("./articlesMenuHandlers");
const ArticlesViewHandlers = require("./articlesViewHandlers");
const ArticlesPreRequestHandlers = require("./articlesPreRequestHandlers");
const ArticlesEventHandlers = require("./articlesEventHandlers");

class ArticlesStarter {
    async onStart(MantraAPI) {
        MantraAPI.Hooks("articles")
            .Api([{
                APIName: "getcountbyuser",
                APIHandler: ArticlesApiHandlers.GetCountByUser
            }, {
                APIName: "getpagedbyuser",
                APIHandler: ArticlesApiHandlers.GetPagedByUser
            }, {
                APIName: "getarticletitle",
                APIHandler: ArticlesApiHandlers.GetArticleTitle
            }, {
                APIName: "existsbyid",
                APIHandler: ArticlesApiHandlers.ExistsById
            }])
            .View([{
                Command: "addnew",
                Handler: ArticlesViewHandlers.AddNew,
                AccessCondition: ["system.islogged", "admin.isuseradmincheck"]
            }, {
                Command: "addnewcompleted",
                Handler: ArticlesViewHandlers.AddNewCompleted,
                AccessCondition: ["system.islogged", "admin.isuseradmincheck"]                
            }, {
                Command: "showblog",
                Handler: ArticlesViewHandlers.ShowBlog,
                AccessCondition: ["pager.checkfirstpage"],
                PreRequest: ["articles.getpagenumber"]
            }, {
                Command: "edit",
                Handler: ArticlesViewHandlers.Edit,
                AccessCondition: ["system.islogged", "admin.isuseradmincheck"],
                PreRequest: ["articles.checkforeditorremove"]
            }, {
                Command: "editcompleted",
                Handler: ArticlesViewHandlers.EditCompleted,
                AccessCondition: ["system.islogged", "admin.isuseradmincheck"],
            }, {
                Command: "remove",
                Handler: ArticlesViewHandlers.Remove,
                AccessCondition: ["system.islogged", "admin.isuseradmincheck"],
                PreRequest: ["articles.checkforeditorremove"]
            }, {
                Command: "removecompleted",
                Handler: ArticlesViewHandlers.RemoveCompleted,
                AccessCondition: ["system.islogged", "admin.isuseradmincheck"],
            }, {
                Command: "articlefull",
                Handler: ArticlesViewHandlers.ShowArticleFull,
                PreRequest: ["articles.getarticleidfromquery"]
            }, {
                Command: "showallarticles",
                Handler: ArticlesViewHandlers.ShowAllArticles,
                AccessCondition: ["system.islogged", "admin.isuseradmincheck", "pager.checkfirstpage"],
            }, {
                Command: "*",
                Handler: ArticlesViewHandlers.ShowArticle,
                PreRequest: ["articles.getarticleidfromurl", "articles.checkarticleexists"]
            }])
            .Menu({
                MenuHandler: ArticlesMenuHandlers.ArticlesAdminOptions,
                IsNotLoggedMenu: false,
                IsUserMenu: false,
                IsAdminMenu: true
            })
            .PreRequest([{
                Name: "articles.getarticleidfromurl",
                Handler: ArticlesPreRequestHandlers.GetArticleIdFromUrl
            }, {
                Name: "articles.checkarticleexists",
                Handler: ArticlesPreRequestHandlers.CheckArticleExists,
                CancelRequestRedirectHandler: ArticlesPreRequestHandlers.NotFoundRedirect
            }, {
                Name: "articles.checkforeditorremove",
                Handler: ArticlesPreRequestHandlers.CheckForEditOrRemove
            }, {
                Name: "articles.getpagenumber",
                Handler: ArticlesPreRequestHandlers.GetPageNumber
            }, {
                Name: "articles.getarticleidfromquery",
                Handler: ArticlesPreRequestHandlers.GetArticleIdFromQuery
            }])
            .Block([{
                BlockName: "actionsonarticleblock",
                RenderHandler: ArticlesBlockHandlers.ActionsOnArticles,
                AccessCondition:["system.islogged"]
            }, {
                BlockName: "article-view-options-block",
                Js: [ "articleviewoptions" ]
            }, {
                BlockName: "article-view-externallink-block"
            }, {
                BlockName: "article-return-normal-view-block"
            }])
            .Event([{
                EventName: "users.removed",
                EventHandler: ArticlesEventHandlers.OnUserRemoved
            }]);
    }
}

class ArticlesInstallation {
    async onInstall(MantraAPI) {
        return MantraAPI.InstallSchema( "articles" );
    }

    async onUninstall(MantraAPI) {
        return MantraAPI.UninstallSchema( "articles" );
    }
}

module.exports = () => {
    return {
        Start: new ArticlesStarter(),
        Install: new ArticlesInstallation()
    };
}