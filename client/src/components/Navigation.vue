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
                    <li class="nav-item">
                        <a class="nav-link" href="#" @click="openRegistration()">Registration</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" @click="openLogin()">Login</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" @click="openContact()">Contact</a>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
</template>

<script>
    export default {
        name: "navigation",
        methods: {
            openHome() {
                this.$router.push("/home");
            },
            openRegistration() {
                this.$router.push("/registration");
            },
            openLogin() {
                this.$router.push("/login");
            }
        }
    }
</script>