"user strict";

const ArticlesRepository = require("./articlesRepository");

module.exports = {
    ActionsOnArticles: async (MantraAPI, html) => {
        // Check if current user is the owner of the article
        let articleId = MantraAPI.GetRequestData( "articleid" );
        let userOwnerId = await ArticlesRepository.GetUserIdByArticleId(MantraAPI, articleId);
        let userId = MantraAPI.GetSecurityToken().userID;

        if ( userId == userOwnerId ) {
            return MantraAPI.RenderHtml( html, { articleid: articleId } );
        }
        
        return "";
    }
}