"use strict";

const ArticlesRepository = require("./articlesRepository");

module.exports = {
    /*
     * API articles.getcountbyuser
     * Returns the number of articles by user
     */
    GetCountByUser: async (MantraAPI, userId) => {
        return ArticlesRepository.GetCountByUser( MantraAPI, userId );
    },

    /*
     * API articles.getpagedbyuser
     * Returns the articles of an used paged
     * Params:
     *    data.userId: <user id of the articles to retrieved>
     *    data.start: <start position to paginate the articles of the user>
     *    data.count: <number of articles to retrieved from start position>
     */
    GetPagedByUser: async (MantraAPI, data) => {
        return ArticlesRepository.GetPagedByUser( MantraAPI, data.userId, data.start, data.count );
    },

    /*
     * API articles.getarticletitle
     * Returns the title of an article by its id
     */
    GetArticleTitle: async (MantraAPI, articleId) => {
        return ArticlesRepository.GetArticleTitle( MantraAPI, articleId );
    },

    /*
     * API articles.existsbyid
     * Return true if an article with that id exists
     */ 
    ExistsById: async (MantraAPI, articleId) => {
        return ArticlesRepository.ExistsById( MantraAPI, articleId );
    }
}