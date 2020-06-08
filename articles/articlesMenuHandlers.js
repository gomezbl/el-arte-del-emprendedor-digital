"use strict";

module.exports = {
    ArticlesAdminOptions: (MantraAPI) => {
        return [
            {
                href: "/articles/addnew",
                text: "Nuevo artículo",
                icon: "fa-lock",
                weight: 1000
            },
            {
                href: "/articles/showallarticles",
                text: "Artículos",
                icon: "fa-lock",
                weight: 1000
            }
        ];
    }
}