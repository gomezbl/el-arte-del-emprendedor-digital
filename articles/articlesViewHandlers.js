"use strict";

const ArticlesRepository = require("./articlesRepository");
const ArticlesShow = require("./articlesShow");

const SHOWALLARTICLES_PAGECOUNT = 20;

const DEFAULT_CONTENTTYPES = [ { value: "blog", text: "Blog" },
                       { value: "story", text: "Historias (relato corto, cuento, cualquier otra cosa...)" },
                       { value: "article", text: "Artículo" } ];

module.exports = {
    AddNew: async (req,res) => {
        let newWorkflow = await res.MantraAPI.Invoke("workflows.start", {
            workflowkey: "articles.new",
            component: "articles",
            workflowname: "article",
            view: "hdlutils.workflowcontainer02",
            viewData: { title: "Nuevo artículo" },
            completedView: "addnewcompleted",
            initialValues: { contenttypes: { default: "story", values: getContentTypes(res.MantraAPI) }, title: "", subtitle: "", content: "", published: false },
        });

        res.MantraAPI.Redirect( newWorkflow.urlFirstStep );
    }, 

    AddNewCompleted: async (req,res) => {
        let workflowId = req.query.w;
        let userId = res.MantraAPI.GetSecurityToken().userID;

        let data = await res.MantraAPI.Invoke("workflows.getworkflowdata", workflowId);

        let articleId = await ArticlesRepository.Add( res.MantraAPI, userId, data.articletitle, data.articlesubtitle, data.contenttype, { data: data.articlecontent }, data.articlepublished );

        res.MantraAPI.Redirect("/articles/"+articleId);
    },

    Edit: async (req,res) => {
        let api = res.MantraAPI;
        let articleId = api.GetRequestData( "articleid" );

        let articleEntity = await ArticlesRepository.GetById( api, articleId );

        articleEntity.content = articleEntity.content.data;
        articleEntity.contenttypes = { default: articleEntity.type, values: getContentTypes(api) };

        let newWorkflow = await res.MantraAPI.Invoke("workflows.start", {
            workflowkey: "articles.edit",
            component: "articles",
            workflowname: "article",
            view: "hdlutils.workflowcontainer02",
            viewData: { title: "Editar artículo" },
            completedView: "editcompleted",
            initialValues: articleEntity,
            params: { articleId: api.GetRequestData( "articleid" ) }
        });

        res.MantraAPI.Redirect( newWorkflow.urlFirstStep );
    },

    EditCompleted: async (req,res) => {
        let workflowId = req.query.w;

        let data = await res.MantraAPI.Invoke("workflows.getworkflowdata", workflowId);

        ArticlesRepository.Update( res.MantraAPI, data.params.articleId, data.articletitle, data.articlesubtitle, data.contenttype, { data: data.articlecontent }, data.articlepublished );

        res.MantraAPI.Redirect(`/articles/${data.params.articleId}`);
    },

    Remove: async (req,res) => {
        let api = res.MantraAPI;

        let newWorkflow = await res.MantraAPI.Invoke("workflows.start", {
            workflowkey: "articles.remove",
            component: "articles",
            workflowname: "removearticle",
            view: "hdlutils.workflowcontainer01",
            viewData: { title: "Eliminar artículo" },
            completedView: "removecompleted",
            params: { articleIdToRemove: api.GetRequestData( "articleid" ) }
        });

        return res.MantraAPI.Redirect( newWorkflow.urlFirstStep );        
    },

    RemoveCompleted: async (req,res) => {
        let workflowId = req.query.w;

        let data = await res.MantraAPI.Invoke("workflows.getworkflowdata", workflowId);

        await ArticlesRepository.Remove( res.MantraAPI, data.params.articleIdToRemove );

        return res.MantraAPI.Redirect( "/userarticles/showuserarticles" );
    },

    ShowArticleFull: async (req,res) => {
        let api = res.MantraAPI;
        let articleId = api.GetRequestData("articleid");

        let article = await getArticleToRender( api, articleId );

        api.AddRenderValues({
            title: article.title,
            subtitle: article.subtitle,
            date: article.date,
            content: article.content.data,
            authorlink: article.authorlink,
            authorfullname: article.authorfullname,
            authoravatarlink: article.authoravatarlink,
            articleid: articleId
        })
            .AddCss("articles.showarticle")
            .RenderView("articles.articlefull", "articlefull.html");
    },

    ShowArticle: async (req,res) => {
        let api = res.MantraAPI;
        let articleId = api.GetRequestData( "articleid" );

        let article = await getArticleToRender( api, articleId );

        api.AddRenderValues({
            title: article.title,
            subtitle: article.subtitle,
            date: article.date,
            content: article.content.data,
            authorlink: article.authorlink,
            authorfullname: article.authorfullname,
            authoravatarlink: article.authoravatarlink,
            articleid: articleId
        })
            .AddCss("articles.showarticle")
            .RenderView("articles.article");
    },

    ShowArticles: async (req,res) => {
        return ArticlesShow.Show( res.MantraAPI, "article" );
    },

    ShowBlog: async (req,res) => {
        return ArticlesShow.Show( res.MantraAPI, "blog" );
    },

    ShowStories: async (req,res) => {
        return ArticlesShow.Show( res.MantraAPI, "story" );
    },

    ShowNews: async (req,res) => {
        return ArticlesShow.Show( res.MantraAPI, "news" );
    },

    ShowAllArticles: async (req,res) => {
        let api = res.MantraAPI;

        let pagerConfig = {
            currentPage: 0,
            pageSize: SHOWALLARTICLES_PAGECOUNT,
            itemsCount: 100,
            component: "articles",
            command: "showallarticles"    
        };

        pagerConfig.itemsCount = await ArticlesRepository.GetCountAll(res.MantraAPI);
        pagerConfig.currentPage = parseInt(req.query.p);

        let articles = await ArticlesRepository.GetPagedAll( res.MantraAPI, pagerConfig.currentPage * pagerConfig.pageSize, pagerConfig.pageSize );

        articles = await res.MantraAPI.Invoke("date.formatbyproperty", { entities: articles, property: "created" } );

        for( let article of articles ) {
            article.username = await api.Invoke("users.getuserfullname", article.userid);
        }

        api.AddRenderValues({
            pager: await api.Invoke("pager.createpager", pagerConfig),
            users: await api.RenderTemplate("articles/articlerow", articles)
        });

        api.RenderView("articles.showallarticles");
    }
}

function getContentTypes( MantraAPI ) {
    let contentTypes = [...DEFAULT_CONTENTTYPES];

    if ( MantraAPI.GetSecurityToken().isCurrentUserInRol("admin") ) {
        contentTypes.push( { value: "news", text: "Noticia" } );
    }
    
    return contentTypes;
}

async function getArticleToRender( MantraAPI, articleId ) {
    let article = await ArticlesRepository.GetById( MantraAPI, articleId );
    let userFullName = await MantraAPI.Invoke("users.getuserfullname", article.userid);            
    let avatarFileId = await MantraAPI.Invoke("users.getavatarfileid", article.userid);
    let isAuthor = await MantraAPI.Invoke("authors.IsUserAnAuthor", article.userid );        
    
    article.authorlink = isAuthor ? `/author/${article.userid}` : `/userpublicprofile/${article.userid}`;
    article.authorfullname = userFullName;
    article.authoravatarlink = `/swr/avatarextrasmall/-/${avatarFileId}`;
    
    article.date = await MantraAPI.Invoke("date.format", { date: article.created, format: "F2" } );

    return article;
}