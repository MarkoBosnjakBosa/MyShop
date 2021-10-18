module.exports = function(spawn, cron, moment, fs, path) {
	var dateFormat = "DD.MM.YYYY";
	var currentDate = moment().format(dateFormat);
	var oldDate = moment().subtract(7, "days").format(dateFormat);
	var dateAndTimeFormat = "DD.MM.YYYY HH:mm:ss";
	var stream = fs.createWriteStream(path.join(__dirname, "/logs.md"), {flags:"a"});
	
	cron.schedule("0 0 * * *", function() {
		createBackup();
		removeBackup();
	});

	function createBackup() {
		var archive = path.join(__dirname, "/backups/MyShop_", currentDate, ".gzip");
		var child = spawn("mongodump", ["--db=myshop", "--archive=" + archive, "--gzip"]);
		var dateAndTime = moment().format(dateAndTimeFormat);
		child.stdout.on("data", (data) => {
			stream.write("\n" + dateAndTime + " Stdout: " + data);
		});
		child.stderr.on("data", (data) => {
			stream.write("\n" + dateAndTime + " Stderr: " + Buffer.from(data).toString());
		});
		child.on("error", (error) => {
			stream.write("\n" + dateAndTime + " Error: " + error);
		});
		child.on("exit", (code, signal) => {
			if(code) stream.write("\n" + dateAndTime + " Process exits with code: " + code);
			else if(signal) stream.write("\n" + dateAndTime + " Process killed with signal: " + signal);
			else stream.write("\n" + dateAndTime + " Backup **MyShop_" + currentDate + ".gzip** has been successfully created!");
		});
	}

	function removeBackup() {
		var archive = path.join(__dirname, "/backups/MyShop_", oldDate, ".gzip");
		if(fs.existsSync(archive)) {
			fs.unlink(archive, function(error) {
				var dateAndTime = moment().format(dateAndTimeFormat);
				if(error) {
					stream.write("\n" + dateAndTime + " Backup **MyShop_" + oldDate + ".gzip** has not been deleted!");
				} else {
					stream.write("\n" + dateAndTime + " Backup **MyShop_" + oldDate + ".gzip** has been successfully deleted!");
				}
			});
		}
	}
}