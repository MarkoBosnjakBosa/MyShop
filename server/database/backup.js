module.exports = function(spawn, fs, path, moment) {
	var dateFormat = "DD.MM.YYYY";
	var date = moment().format(dateFormat);
	var archive = path.join(__dirname, "/backups/MyShop" + date + ".gzip");
	const child = spawn("mongodump", ["--db=myshop", "--archive=" + archive, "--gzip"]);

	child.on("error", (error) => {
		console.log("Error:\n", error);
	});
	child.on("exit", (code, signal) => {
		if(code) console.log("Process exits with code: " + code);
		else if(signal) console.log("Process killed with signal: " + signal);
		else console.log("Backup for MyShop is successfully created!");
	});
}