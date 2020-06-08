"use strict";

const BookshelfsRepository = require("./bookshelfsRepository");

module.exports = {
    NoExists: async (element, MantraAPI) => {
        let userId = MantraAPI.GetSecurityToken().userID;

        let exists = await BookshelfsRepository.ExistsBookshelfByNameAndUserId( MantraAPI, element.value, userId );
        
        if ( exists ) {
            return { validation: false, message: "Ya existe una estantería con ese nombre", element: element };
        }
        
        return { validation: true, element: element };
    }
}