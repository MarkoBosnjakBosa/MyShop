<template>
    <div id="navigation" class="container-fluid">
        <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarOptions" aria-expanded="false">
                <span class="navbar-toggler-icon"></span>
            </button>
            <button type="button" id="toggleSidebar" class="btn btn-dark" @click="toggleSidebar()"><i class="fas fa-angle-double-left"></i></button>
            <div id="navbarOptions" class="collapse navbar-collapse">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a href="#" class="nav-link" @click="openHome()">Home</a>
                    </li>
                    <li v-if="!userData.isLoggedIn && !userData.isAdmin" class="nav-item">
                        <a href="#" class="nav-link" @click="openContact()">Contact</a>
                    </li>
                    <li v-if="!userData.isLoggedIn" class="nav-item">
                        <a href="#" class="nav-link" @click="openRegistration()">Registration</a>
                    </li>
                    <li v-if="!userData.isLoggedIn" class="nav-item">
                        <a href="#" class="nav-link" @click="openLogin()">Login</a>
                    </li>
                    <li v-if="userData.isLoggedIn" class="nav-item dropdown">
                        <a href="#" id="userOptions" class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="far fa-user-circle"></i></a>
                        <ul class="dropdown-menu" :class="userData.isAdmin ? 'adminDropdownMenu' : 'userDropdownMenu'" aria-labelledby="userOptions">
                            <li><a href="#" class="dropdown-item" @click="openProfile()">Profile</a></li>
                            <li><a href="#" class="dropdown-item" @click="openSetup()">Authentication</a></li>
                            <li><a v-if="!userData.isAdmin" href="#" class="dropdown-item" @click="openViewOrders()">Orders</a></li>
                            <li><a href="#" class="dropdown-item" @click="logout()">Log out</a></li>
                        </ul>
                    </li>
                    <li v-if="userData.isLoggedIn && !userData.isAdmin" class="nav-item dropdown">
                        <cart></cart>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
</template>

<script>
    import checkLogin from "./CheckLogin.vue";
    import helper from "./Helper.vue";
    import route from "./Route.vue";
    import cart from "./Cart.vue";

    export default {
        name: "navigation",
        components: {
            cart
        },
        data() {
            return {
                userData: {
                    isLoggedIn: false,
                    username: "",
                    isAdmin: false
                }
            }
        },
        methods: {
            getUserData() {
                this.userData = checkLogin.methods.getUserData();
            },
            toggleSidebar() {
                helper.methods.toggleSidebar();
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
            openViewOrders() {
                route.methods.openViewOrders();
            },
            openLogin() {
                route.methods.openLogin();
            },
            logout() {
                route.methods.logout();
            }
        },
        created() {
            this.getUserData();
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
    .adminDropdownMenu {
        left: -115px !important;
        margin-top: 8px !important;
    }
    .userDropdownMenu {
        left: -40px !important;
        margin-top: 8px !important;
    }
</style>