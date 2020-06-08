"use strict";

const ArticlesRepository = require("./articlesRepository");

module.exports = {
    OnUserRemoved: async (eventData) => {
        return ArticlesRepository.RemoveByUserId( eventData.MantraAPI, eventData.userId );
    }
}