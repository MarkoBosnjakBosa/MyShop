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
            createDecimalNumber(price) {
                if(!price.includes(".")) {
                    return price + ".00";
                } else {
                    return price;
                }
            },
            removeDate(imageName) {
                var index = imageName.lastIndexOf("_");
                if(index != -1) {
                    imageName = imageName.substr(0, index) + imageName.substr(imageName.lastIndexOf("."));
                }
                return imageName;
            }
        }
    }
</script>