<script>
    export default {
        name: "helper",
        methods: {
            togglePassword() {
				var type = document.getElementById("password").getAttribute("type");
				switch(type) {
					case "password": {
						document.getElementById("password").setAttribute("type", "text");
						document.getElementById("togglePassword").classList.remove("fa-eye");
						document.getElementById("togglePassword").classList.add("fa-eye-slash");
						return;
					}
					case "text": {
						document.getElementById("password").setAttribute("type", "password");
						document.getElementById("togglePassword").classList.remove("fa-eye-slash");
						document.getElementById("togglePassword").classList.add("fa-eye");
						return;
					}
				}
			},
            toggleTab(tab) {
                switch(tab) {
                    case "account":
                        document.getElementById("accountNavTab").click();
                        break;
                    case "address":
                        document.getElementById("addressNavTab").click();
                        break;
                    case "check":
                        document.getElementById("checkNavTab").click();
                        break;
                    case "main":
                        document.getElementById("mainNavTab").click();
                        break;
                    case "technicalData":
                        document.getElementById("technicalDataNavTab").click();
                        break;
                    case "images":
                        document.getElementById("imagesNavTab").click();
                        break;
                    case "message":
                        document.getElementById("messageNavTab").click();
                        break;
                    case "delete":
                        document.getElementById("deleteNavTab").click();
                        break;
                    case "payment":
                        document.getElementById("paymentNavTab").click();
                        break;
                }
			},
            toggleSidebar() {
                var bars = document.getElementById("barsDiv");
                var toggleSidebar = document.getElementById("toggleSidebar");
                bars.classList.toggle("toggled");
                if(bars.classList.contains("toggled")) {
                    toggleSidebar.innerHTML = "<i class='fas fa-angle-double-right'></i>";
                } else {
                    toggleSidebar.innerHTML = "<i class='fas fa-angle-double-left'></i>";
                }
            },
            renderImage(image) {
                if(image && !(image instanceof File)) return "data:" + image.contentType + ";base64," + (new Buffer.from(image.image)).toString("base64");
                else return "";
            },
            formatNumber(number) {
                number = number.toString();
                if(number.includes(".")) {
                    var decimalPart = number.substr(number.lastIndexOf(".") + 1);
                    if(decimalPart.length == 1){
                        number = number + "0";
                    }
                } else {
                    number = number + ".00";
                }
                return Number(number).toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " €";
            },
            removeDate(imageName) {
                var index = imageName.lastIndexOf("_");
                if(index != -1) imageName = imageName.substr(0, index) + imageName.substr(imageName.lastIndexOf("."));
                return imageName;
            }
        }
    }
</script>