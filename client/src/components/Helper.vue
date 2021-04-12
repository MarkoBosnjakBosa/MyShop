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
                }
			},
            closeAlert(type) {
                switch (type) {
                    case "account":
                        this.accountEdited = false;
                        break;
                    case "address":
                        this.addressEdited = false;
                        break;
                    case "resetPassword":
                        this.passwordReset = false;
                        break;
                }
			}
        }
    }
</script>