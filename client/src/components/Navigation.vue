<template>
    <div id="navigation" class="container-fluid">
        <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbarOptions" aria-controls="navbarOptions" aria-expanded="false">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div id="navbarOptions" class="collapse navbar-collapse">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#" @click="openHome()">Home</a>
                    </li>
                    <li v-if="!isAdmin" class="nav-item">
                        <a class="nav-link" href="#" @click="openContact()">Contact</a>
                    </li>
                    <li v-if="!userLoggedIn" class="nav-item">
                        <a class="nav-link" href="#" @click="openRegistration()">Registration</a>
                    </li>
                    <li v-if="userLoggedIn" class="nav-item dropdown">
                        <a id="userOptions" href="#" class="nav-link dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{username}}</a>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userOptions">
                            <a class="dropdown-item" href="#" @click="openProfile()">Profile</a>
                            <a class="dropdown-item" href="#" @click="openSetup()">Authentication</a>
                            <a v-if="!isAdmin" class="dropdown-item" href="#" @click="openOrders()">Orders</a>
                            <a class="dropdown-item" href="#" @click="logout()">Log out</a>
                        </div>
                    </li>
                    <li v-else class="nav-item">
                        <a class="nav-link" href="#" @click="openLogin()">Login</a>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
</template>

<script>
    import route from "@/components/Route.vue";

    export default {
        name: "navigation",
        data() {
			return {
				userLoggedIn: false,
                username: "",
                isAdmin: false
			}
		},
        methods: {
            isLoggedIn() {
                if(this.$store.getters.isLoggedIn) this.userLoggedIn = true;
                this.username = this.$store.getters.getUser;
                this.isAdmin = this.$store.getters.isAdmin;
            },
            openHome() {
                route.methods.openHome();
            },
            openContact() {
                route.methods.openContact();
            },
            openRegistration() {
                route.methods.openRegistration();
            },
            openProfile() {
                route.methods.openProfile();
            },
            openSetup() {
                route.methods.openSetup();
            },
            openOrders() {
                route.methods.openOrders();
            },
            openLogin() {
                route.methods.openLogin();
            },
            logout() {
                route.methods.logout();
            },
        },
        mounted() {
            this.isLoggedIn();
            //var currentPage = this.$route.fullPath;
        }
    }
</script>