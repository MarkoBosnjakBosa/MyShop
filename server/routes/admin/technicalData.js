module.exports = function(app, models, checkStatus, checkPermission, validations) {
    const TechnicalInformation = models.TechnicalInformation;
    app.get("/getTechnicalData", [checkStatus.isLoggedIn, checkPermission.isAdmin], (request, response) => {
        var query = {};
        TechnicalInformation.find(query).then(technicalData => {
            response.status(200).json({technicalData: technicalData}).end();
        }).catch(error => console.log(error));
    });
    app.post("/createTechnicalInformation", [checkStatus.isLoggedIn, checkPermission.isAdmin, validations.validateTechnicalInformationCreation], (request, response) => {
        var title = request.body.title;
        var newTechnicalInformation = getTechnicalInformationScheme(TechnicalInformation, title);
        newTechnicalInformation.save().then(technicalInformation => {
            response.status(200).json({created: true, technicalInformation: technicalInformation}).end();
        }).catch(error => console.log(error));
    });
    app.put("/editTechnicalInformation", [checkStatus.isLoggedIn, checkPermission.isAdmin, validations.validateTechnicalInformationEdit], (request, response) => {
        var technicalInformationId = request.body.technicalInformationId;
        var title = request.body.title;
        var query = {_id: technicalInformationId};
        var update = {title: title};
        var options = {new: true};
        TechnicalInformation.findOneAndUpdate(query, update, options).then(technicalInformation => {
            if(!validations.isEmpty(technicalInformation)) {
                response.status(200).json({edited: true}).end();
            } else {
                response.status(200).json({edited: false}).end();
            }
        }).catch(error => console.log(error));
    });
    app.delete("/deleteTechnicalInformation/:technicalInformationId", [checkStatus.isLoggedIn, checkPermission.isAdmin], (request, response) => {
        var technicalInformationId = request.params.technicalInformationId;
        var query = {_id: technicalInformationId};
        TechnicalInformation.findOneAndDelete(query).then(technicalInformation => {
            if(!validations.isEmpty(technicalInformation)) {
                response.status(200).json({deleted: true}).end();
            } else {
                response.status(200).json({deleted: false}).end();
            }
        }).catch(error => console.log(error));
    });

    function getTechnicalInformationScheme(TechnicalInformation, title) {
        return new TechnicalInformation({title: title});
    }
}