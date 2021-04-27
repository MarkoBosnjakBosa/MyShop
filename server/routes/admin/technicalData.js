module.exports = function(app, models, validation) {
    const TechnicalInformation = models.TechnicalInformation;
    app.get("/getTechnicalData", (request, response) => {
        var query = {};
        TechnicalInformation.find(query).then(technicalData => {
            response.status(200).json({technicalData: technicalData}).end();
        }).catch(error => console.log(error));
    });
    app.post("/createTechnicalInformation", (request, response) => {
        var allowCreation = true;
        var errorFields = [];
        var title = request.body.title;
        if(validation.invalidTitle(title)) {
            errorFields.push("title");
            allowCreation = false;
        }
        if(allowCreation) {
            var newTechnicalInformation = getTechnicalInformationScheme(TechnicalInformation, title);
            newTechnicalInformation.save().then(technicalInformation => {
                response.status(200).json({created: true, technicalInformation: technicalInformation}).end();
            }).catch(error => console.log(error));
        } else {
            response.status(200).json({created: false, errorFields: errorFields}).end();
        }
    });
    app.put("/editTechnicalInformation", (request, response) => {
        var technicalInformationId = request.body.technicalInformationId;
        var title = request.body.title;
        if(technicalInformationId && !validation.invalidTitle(title)) {
            var query = {_id: technicalInformationId};
            var update = {title: title};
            TechnicalInformation.findOneAndUpdate(query, update, {new: true}).then(technicalInformation => {
                if(!validation.isEmpty(technicalInformation)) {
                    response.status(200).json({edited: true}).end();
                } else {
                    response.status(200).json({edited: false}).end();
                }
            }).catch(error => console.log(error));
        } else {
            response.status(200).json({edited: false}).end();
        }
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