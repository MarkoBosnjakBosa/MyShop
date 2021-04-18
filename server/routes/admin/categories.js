module.exports = function(app, models, validation) {
    const Category = models.Category;
    app.get("/getCategories", (request, response) => {
        var query = {};
        Category.find(query).then(categories => {
            response.status(200).json({categories: categories}).end();
        }).catch(error => console.log(error));
    });
    app.post("/createCategory", (request, response) => {
        var allowCreation = true;
        var errorFields = [];
        var title = request.body.title;
        if(validation.invalidTitle(title)) {
            errorFields.push("title");
            allowCreation = false;
        }
        var icon = request.body.icon;
        if(validation.invalidIcon(icon)) {
            errorFields.push("icon");
            allowCreation = false;
        }
        if(allowCreation) {
            var newCategory = getCategoryScheme(Category, title, icon);
            newCategory.save().then(category => {
                response.status(200).json({created: true, category: category}).end();
            }).catch(error => console.log(error));
        } else {
            response.status(200).json({created: false, errorFields: errorFields}).end();
        }
    });
    app.put("/editCategory", (request, response) => {
        var categoryId = request.body.categoryId;
        var title = request.body.title;
        var icon = request.body.icon;
        if(categoryId && !validation.invalidTitle(title) && !validation.invalidIcon(icon)) {
            var query = {_id: categoryId};
            var update = {title: title, icon: icon};
            Category.findOneAndUpdate(query, update, {new: true}).then(category => {
                if(!validation.isEmpty(category)) {
                    response.status(200).json({edited: true}).end();
                } else {
                    response.status(200).json({edited: false}).end();
                }
            }).catch(error => console.log(error));
        } else {
            response.status(200).json({edited: false}).end();
        }
    });
    app.delete("/deleteCategory/:categoryId", (request, response) => {
        var categoryId = request.params.categoryId;
        if(categoryId) {
            var query = {_id: categoryId};
            Category.findOneAndRemove(query).then(category => {
                if(!validation.isEmpty(category)) {
                    response.status(200).json({deleted: true}).end();
                } else {
                    response.status(200).json({deleted: false}).end();
                }
            }).catch(error => console.log(error));
        } else {
            response.status(200).json({deleted: false}).end();
        }
    });

    function getCategoryScheme(Category, title, icon) {
        return new Category({title: title, icon: icon});
    }
}