module.exports = function(app, models, validation) {
    const TechnicalInformation = models.TechnicalInformation;
    app.get("/getTechnicalData", (request, response) => {
        var query = {};
        TechnicalInformation.find(query).then(technicalData => {
            response.status(200).json({technicalData: technicalData}).end();
        }).catch(error => console.log(error));
    });
    app.post("/createTechnicalInformation", validation.validateTechnicalInformationCreation, (request, response) => {
        var title = request.body.title;
        var newTechnicalInformation = getTechnicalInformationScheme(TechnicalInformation, title);
        newTechnicalInformation.save().then(technicalInformation => {
            response.status(200).json({created: true, technicalInformation: technicalInformation}).end();
        }).catch(error => console.log(error));
    });
    app.put("/editTechnicalInformation", validation.validateTechnicalInformationEdit, (request, response) => {
        var query = {_id: technicalInformationId};
        var update = {title: title};
        TechnicalInformation.findOneAndUpdate(query, update, {new: true}).then(technicalInformation => {
            if(!validation.isEmpty(technicalInformation)) {
                response.status(200).json({edited: true}).end();
            } else {
                response.status(200).json({edited: false}).end();
            }
        }).catch(error => console.log(error));
    });
    app.delete("/deleteTechnicalInformation/:technicalInformationId", (request, response) => {
        var technicalInformationId = request.params.technicalInformationId;
        if(technicalInformationId) {
            var query = {_id: technicalInformationId};
            TechnicalInformation.findOneAndRemove(query).then(technicalInformation => {
                if(!validation.isEmpty(technicalInformation)) {
                    response.status(200).json({deleted: true}).end();
                } else {
                    response.status(200).json({deleted: false}).end();
                }
            }).catch(error => console.log(error));
        } else {
            response.status(200).json({deleted: false}).end();
        }
    });

    function getTechnicalInformationScheme(TechnicalInformation, title) {
        return new TechnicalInformation({title: title});
    }
}