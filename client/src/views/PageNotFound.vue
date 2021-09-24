<template>
    <div id="pageNotFound" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <div class="pageNotFound">
                    <div class="alert alert-danger" role="alert">Page not found!</div>
                    <button type="button" class="btn btn-dark" @click="openHome()">Home <i class="fas fa-home"></i></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import navigation from "../components/Navigation.vue";
    import sidebar from "../components/Sidebar.vue";
    import route from "../components/Route.vue";

    export default {
        name: "pageNotFound",
        components: {
            navigation,
            sidebar
        },
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