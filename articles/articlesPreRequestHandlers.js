"use strict";

const ExtractValues = require("extract-values");
const ArticlesRepository = require("./articlesRepository");

module.exports = {
    GetArticleIdFromUrl: async (MantraAPI, req ) => {
        let parts = ExtractValues( req.path, "/articles/{articleid}");
           
        if ( parts ) {
            MantraAPI.AddRequestData( "articleid", parts.articleid );
            return true;
        }

        return false;
    },

    GetArticleIdFromQuery: async (MantraAPI, req) => {
        if ( req.query.q ) {
            let articleId = req.query.q;
            let exists = await ArticlesRepository.Exists( MantraAPI, articleId );
            
            if ( exists ) {
                MantraAPI.AddRequestData( "articleid", articleId );
                return true;
            }
        }

        return false;        
    },

    CheckArticleExists: async (MantraAPI, req ) => {
        return ArticlesRepository.Exists( MantraAPI, MantraAPI.GetRequestData( "articleid" ) );
    },

    GetPageNumber: async (MantraAPI, req ) => {
        MantraAPI.AddRequestData( "pagenumber", parseInt(req.query.p) );

        return true;
    },

    CheckForEditOrRemove: async (MantraAPI, req ) => {
        let articleId = req.query.id;

        if ( articleId ) {
            let exists = await ArticlesRepository.Exists( MantraAPI, articleId );
            if ( exists ) {
                let userOwnerId = await ArticlesRepository.GetUserIdByArticleId(MantraAPI, articleId);
                let userId = MantraAPI.GetSecurityToken().userID;
        
                if ( userId == userOwnerId ) {
                    MantraAPI.AddRequestData( "articleid", articleId );
                    return true;
                }
            }
        }

        return false;
    },

    NotFoundRedirect: async (MantraAPI) => {
        MantraAPI.RenderRoot("404.html");
    }
}