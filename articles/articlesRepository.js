"use strict";

module.exports = {
    Add: async (MantraAPI, userId, title, subtitle, type, content, isPublished ) => {
        let db = MantraAPI.ComponentEntities("articles").articles;

        return db.I().V( {
            userid: userId,
            title: title,
            subtitle: subtitle, 
            type: type,
            content: content,
            published: isPublished
        }).R();
    },

    Update: async (MantraAPI, articleId, title, subtitle, type, content, isPublished ) => {
        let db = MantraAPI.ComponentEntities("articles").articles;

        return db.U().W("ID=?", articleId).V( ["title", "subtitle", "type", "content", "published"],
                                              [title, subtitle, type, content, isPublished]).R();
        
    },

    Exists: async (MantraAPI, articleId) => {
        let db = MantraAPI.ComponentEntities("articles").articles;

        return db.S().W("ID=?",articleId).Exists();
    },

    GetById: async (MantraAPI, articleId) => {
        let db = MantraAPI.ComponentEntities("articles").articles;

        return db.S().W("ID=?",articleId).Single();
    },

    GetUserIdByArticleId: async (MantraAPI, articleId) => {
        let db = MantraAPI.ComponentEntities("articles").articles;
        let entity = await db.S("userid").W("ID=?",articleId).Single();
        
        return entity.userid;
    },

    GetCount: async (MantraAPI, type) => {
        let db = MantraAPI.ComponentEntities("articles").articles;

        return db.S().W("type=? && published=?",[type,true]).Count();
    },

    GetCountAll: async (MantraAPI) => {
        return MantraAPI.ComponentEntities("articles").articles.S().Count();
    },

    GetPaged: async (MantraAPI, type, start, end ) => {
        let db = MantraAPI.ComponentEntities("articles").articles;

        return db.S().W("type=? and published=?", [type,true]).L(start,end).OB("created", false).R();
    },

    GetPagedAll: async (MantraAPI, start, end ) => {
        let db = MantraAPI.ComponentEntities("articles").articles;

        return db.S().L(start,end).OB("created", false).R();
    },

    GetCountByUser: async (MantraAPI, userId ) => {
        let db = MantraAPI.ComponentEntities("articles").articles;

        return db.S().W("userid=?",userId).Count();
    },

    GetPagedByUser: async (MantraAPI, userId, start, count ) => {
        let db = MantraAPI.ComponentEntities("articles").articles;

        return db.S().W("userid=?",userId).L(start,count).OB("created", false).R();
    },

    Remove: async (MantraAPI, articleId) => {
        let db = MantraAPI.ComponentEntities("articles").articles;

        return db.D().DeleteById(articleId);
    },

    RemoveByUserId: async ( MantraAPI, userId ) => {
        let db = MantraAPI.ComponentEntities("articles").articles;

        return db.D().W("userid=?",userId).R();
    },

    GetArticleTitle: async (MantraAPI, articleId) => {
        let db = MantraAPI.ComponentEntities("articles").articles;
        let entity = await db.S("title").SingleById(articleId);

        return entity.title;
    },

    ExistsById: async (MantraAPI, articleId) => {
        let db = MantraAPI.ComponentEntities("articles").articles;

        return db.S().W("ID=?",articleId).Exists();
    }
}