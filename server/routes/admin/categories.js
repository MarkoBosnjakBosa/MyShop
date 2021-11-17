module.exports = function(app, models, validations) {
    const Category = models.Category;
    app.get("/getCategories", (request, response) => {
        var query = {};
        Category.find(query).then(categories => {
            response.status(200).json({categories: categories}).end();
        }).catch(error => console.log(error));
    });
    app.get("/getCategory/:categoryId", (request, response) => {
        var categoryId = request.params.categoryId;
        var query = {_id: categoryId};
        Category.findOne(query).then(category => {
            response.status(200).json({category: category}).end();
        }).catch(error => {
			console.log(error);
			response.status(404).end();
		});
    });
    app.post("/createCategory", validations.validateCategoryCreation, (request, response) => {
        var title = request.body.title;
        var icon = request.body.icon;
        var newCategory = getCategoryScheme(Category, title, icon);
        newCategory.save().then(category => {
            response.status(200).json({created: true, category: category}).end();
        }).catch(error => console.log(error));
    });
    app.put("/editCategory", validations.validateCategoryEdit, (request, response) => {
        var categoryId = request.body.categoryId;
        var title = request.body.title;
        var icon = request.body.icon;
        var query = {_id: categoryId};
        var update = {title: title, icon: icon};
        var options = {new: true};
        Category.findOneAndUpdate(query, update, options).then(category => {
            if(!validations.isEmpty(category)) {
                response.status(200).json({edited: true}).end();
            } else {
                response.status(200).json({edited: false}).end();
            }
        }).catch(error => console.log(error));
    });
    app.delete("/deleteCategory/:categoryId", (request, response) => {
        var categoryId = request.params.categoryId;
        var query = {_id: categoryId};
        Category.findOneAndRemove(query).then(category => {
            if(!validations.isEmpty(category)) {
                response.status(200).json({deleted: true}).end();
            } else {
                response.status(200).json({deleted: false}).end();
            }
        }).catch(error => console.log(error));
    });

    function getCategoryScheme(Category, title, icon) {
        return new Category({title: title, icon: icon});
    }
}