<script>
    export default {
        name: "route",
        methods: {
            openHome() {
                this.$router.push("/home");
            },
            openContact() {
                this.$router.push("/contact");
            },
            openRegistration() {
                this.$router.push("/registration");
            },
            openForgotCredentials() {
				this.$router.push("/forgot/credentials");
			},
            openProfile() {
                this.$router.push("/profile");
            },
            openSetup() {
                this.$router.push("/setup");
            },
            openOrders() {
                this.$router.push("/orders");
            },
            openLogin() {
                this.$router.push("/login");
            },
            openAuthentication() {
                this.$router.push("/authentication");
            },
            logout() {
                this.$store.dispatch("logout");
                this.$router.push("/login");
            }
        }
    }
</script>