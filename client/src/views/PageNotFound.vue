<template>
    <div id="overview" class="container-fluid">
        <div class="container pageNotFoundDiv">
            <div class="alert alert-danger" role="alert">Page not found!</div>
            <button type="button" class="btn btn-info" @click="openLogin()">Proceed to login <i class="fas fa-hand-point-right"></i></button>
        </div>
    </div>
</template>

<script>
    import "bootstrap";
    import "bootstrap/dist/css/bootstrap.min.css";
    import route from "../components/Route.vue";

    export default {
        name: "pageNotFound",
        methods: {
            openLogin() {
                route.methods.openLogin();
            }
        }
    }
</script>

<style scoped>
    .pageNotFoundDiv {
        margin: 0 auto;
        max-width: 400px;
        text-align: center;
        margin-top: 20px;
    }
</style>