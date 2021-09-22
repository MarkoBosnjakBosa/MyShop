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
                        break;
                    }
                    case "text": {
                        document.getElementById("password").setAttribute("type", "password");
                        document.getElementById("togglePassword").classList.remove("fa-eye-slash");
                        document.getElementById("togglePassword").classList.add("fa-eye");
                        break;
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
                    case "resetPassword":
                        document.getElementById("resetPasswordNavTab").click();
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
                    case "map":
                        document.getElementById("mapNavTab").click();
                        break;
                }
            },
            toggleSidebar() {
                var pageContent = document.getElementById("pageContent");
                var toggleSidebar = document.getElementById("toggleSidebar");
                pageContent.classList.toggle("toggled");
                if(pageContent.classList.contains("toggled")) toggleSidebar.innerHTML = "<i class='fas fa-angle-double-right'></i>";
                else toggleSidebar.innerHTML = "<i class='fas fa-angle-double-left'></i>";
            },
            formatNumber(number) {
                return number.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});
            },
            renderImage(image) {
                if(image && !(image instanceof File)) return "data:" + image.contentType + ";base64," + (new Buffer.from(image.image)).toString("base64");
                else return "";
            }
        }
    }
</script>