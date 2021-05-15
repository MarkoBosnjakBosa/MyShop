<template>
    <div id="navigation" class="container-fluid">
        <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbarOptions" aria-controls="navbarOptions" aria-expanded="false">
                <span class="navbar-toggler-icon"></span>
            </button>
            <button v-if="checkRoutePath()" id="toggleSidebar" type="button" class="btn btn-dark" @click="toggleSidebar()"><i class="fas fa-angle-double-left"></i></button>
            <div id="navbarOptions" class="collapse navbar-collapse">
                <ul class="navbar-nav ms-auto">
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
                    <li v-if="userData.userLoggedIn && !userData.isAdmin" class="nav-item dropdown">
                        <cart></cart>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
</template>

<script>
    import checkLogin from "./CheckLogin.vue";
    import route from "./Route.vue";
    import helper from "./Helper.vue";
    import cart from "./Cart.vue";

    export default {
        name: "navigation",
        components: {
            cart
        },
        data() {
			return {
                userData: {
                    userLoggedIn: false,
                    username: "",
                    isAdmin: false
                },
                routePath: ""
			}
		},
        methods: {
            getUserData() {
                this.userData = checkLogin.methods.getUserData();
            },
            checkRoutePath() {
                if(this.routePath != "/login" && this.routePath != "/registration") return true;
                else return false;
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
            toggleSidebar() {
                helper.methods.toggleSidebar();
            }
        },
        mounted() {
            this.getUserData();
            this.routePath = this.$route.path;
        }
    }
</script>

<style scoped>
    #navigation {
        padding: 0px;
    }
    #toggleSidebar {
        margin-left: 5px;
    }
</style>