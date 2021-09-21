<template>
    <div id="pageNotFound" class="container-fluid">
        <div class="pageNotFound">
            <div class="alert alert-danger" role="alert">Page not found!</div>
            <button type="button" class="btn btn-dark" @click="openHome()">Home <i class="fas fa-home"></i></button>
        </div>
    </div>
</template>

<script>
    import route from "../components/Route.vue";

    export default {
        name: "pageNotFound",
        methods: {
            openHome() {
                route.methods.openHome();
            }
        }
    }
</script>

<style scoped>
    .pageNotFound {
        margin: auto;
        max-width: 400px;
        text-align: center;
        margin-top: 20px;
    }
</style>