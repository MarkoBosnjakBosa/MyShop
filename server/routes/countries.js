module.exports = function(app, countryCodes) {
    app.get("/get/phoneCodes", (request, response) => {
        var phoneCodes = countryCodes.customArray(fields = {name: "{countryNameEn}", value: "{countryCallingCode}"}, {sortBy, sortDataBy, filter} = {});
        response.status(200).json({phoneCodes: phoneCodes});
        response.end();
	});
}