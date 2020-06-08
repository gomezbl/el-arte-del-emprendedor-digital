"use strict";

const ArticlesRepository = require("./articlesRepository");

const TEASER_CONTENT_LENGTHWORDS = 750;

module.exports = {
    Show: async (MantraAPI, type) => {
        let pagerConfig = {
            currentPage: 0,
            pageSize: 10,
            itemsCount: 100,
            component: "articles",
            command: "showarticles"    
        };

        pagerConfig.itemsCount = await ArticlesRepository.GetCount(MantraAPI, type);

        if (pagerConfig.itemsCount == 0 ) {
            await MantraAPI.Invoke("messageview.showgeneralmessage", {
                headermessage: "No hay contenidos",
                messagecontent: "Todavía no hay contenidos de este tipo"
            });
        } else {
            pagerConfig.currentPage = MantraAPI.GetRequestData("pagenumber");
    
            let articles = await ArticlesRepository.GetPaged( MantraAPI, type, pagerConfig.currentPage * pagerConfig.pageSize, pagerConfig.pageSize );
    
            if( articles.length == 0 ) {
                return MantraAPI.Redirect( MantraAPI.GetRequest().path );
            }

            for( let article of articles ) {
                let isAuthor = await MantraAPI.Invoke("authors.IsUserAnAuthor", article.userid );        
                article.authorfullname = await MantraAPI.Invoke("users.getuserfullname", article.userid);                
                article.authorlink = isAuthor ? `/author/${article.userid}` : (await MantraAPI.Invoke("userpublicprofile.getpublicprofilelink", article.userid ));
                article.date = await MantraAPI.Invoke("date.format", { date: article.created, format: "F2" } );
                article.content = article.content.data;

                checkTeaserLength( article );
            }

            MantraAPI.AddRenderValues({
                pager: await MantraAPI.Invoke("pager.createpager", pagerConfig),
                articles: await MantraAPI.RenderTemplate("articles/articleteaser", articles) })
                     .AddCss( "articles.showarticle" )
                     .RenderView("articles.showarticles");
        }
    }
}

function checkTeaserLength( article ) {
    if ( article.content.length > TEASER_CONTENT_LENGTHWORDS ) {
        let teaser = article.content.substr(0,TEASER_CONTENT_LENGTHWORDS);
        let lastSpace = teaser.lastIndexOf("</p>");

        if ( lastSpace == -1 ) lastSpace = teaser.lastIndexOf(" ");

        teaser = teaser.substr(0,lastSpace);
        teaser += ` <small><a href='/articles/${article.ID}'>Leer más</a></small>`;

        article.content = teaser;
    }
}