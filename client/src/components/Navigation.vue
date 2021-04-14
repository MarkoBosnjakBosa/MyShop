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
                    <li v-if="!userData.isAdmin" class="nav-item">
                        <a class="nav-link" href="#" @click="openContact()">Contact</a>
                    </li>
                    <li v-if="!userData.userLoggedIn" class="nav-item">
                        <a class="nav-link" href="#" @click="openRegistration()">Registration</a>
                    </li>
                    <li v-if="userData.userLoggedIn" class="nav-item dropdown">
                        <a id="userOptions" href="#" class="nav-link dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{userData.username}}</a>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userOptions">
                            <a class="dropdown-item" href="#" @click="openProfile()">Profile</a>
                            <a class="dropdown-item" href="#" @click="openSetup()">Authentication</a>
                            <a v-if="!userData.isAdmin" class="dropdown-item" href="#" @click="openOrders()">Orders</a>
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
    import checkLogin from "@/components/CheckLogin.vue";
    import route from "@/components/Route.vue";

    export default {
        name: "navigation",
        data() {
			return {
                userData: {
                    userLoggedIn: false,
                    username: "",
                    isAdmin: false
                }
			}
		},
        methods: {
            getUserData() {
                this.userData = checkLogin.methods.getUserData();
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
            this.getUserData();
        }
    }
</script>