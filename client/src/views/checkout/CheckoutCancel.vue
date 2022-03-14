<template>
    <div id="checkoutCancel" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <div class="checkoutCancel">
                    <div class="alert alert-danger" role="alert">
                        Something went wrong. Please contact the admin team.
                    </div>
                    <button type="button" class="btn btn-dark" @click="openContact()">Contact</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import checkLogin from "../../components/CheckLogin.vue";
    import navigation from "../../components/Navigation.vue";
    import sidebar from "../../components/Sidebar.vue";
    import route from "../../components/Route.vue";

    export default {
        name: "checkoutCancel",
        components: {
            navigation,
            sidebar
        },
        methods: {
            openContact() {
                route.methods.openContact();
            }
        },
        created() {
            checkLogin.methods.isLoggedIn(function(isLoggedIn) {
                if(!isLoggedIn) route.methods.openLogin();
            });
        }
    }
</script>

<style scoped>
    .checkoutCancel {
        margin: auto;
        max-width: 500px;
        margin-top: 20px;
        text-align: center;
    }
</style>