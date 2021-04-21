<template>
    <div id="sidebarDiv" class="bg-light border-right">
        <div class="heading">
            <span v-if="userData.isAdmin">MyShop Admin</span>
            <span v-else>MyShop</span>    
        </div>
        <ul class="list list-group-flush">
            <li class="list-group-item list-group-item-action bg-light" @click="openHome()">Home</li>
            <li class="list-group-item list-group-item-action bg-light" @click="openProducts()">Products</li>
            <li class="list-group-item list-group-item-action bg-light" @click="openCreateProduct()"> Create Product</li>
            <li class="list-group-item list-group-item-action bg-light" @click="openCategories()">Categories</li>
            <li class="list-group-item list-group-item-action bg-light" @click="openTechnicalData()">Technical Data</li>
        </ul>
    </div>
</template>

<script>
    import checkLogin from "../components/CheckLogin.vue";
    import route from "../components/Route.vue";

    export default {
        name: "sidebar",
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
            openProducts() {
                route.methods.openProducts();
            },
            openCreateProduct() {
                route.methods.openCreateProduct();
            },
            openCategories() {
                route.methods.openCategories();
            },
            openTechnicalData() {
                route.methods.openTechnicalData();
            }
        },
        mounted() {
            this.getUserData();
        }
    }
</script>

<style>
#barsDiv {
    overflow-x: hidden;
}
#sidebarDiv {
    min-height: 100vh;
    margin-left: -15rem;
    -webkit-transition: margin .25s ease-out;
    -moz-transition: margin .25s ease-out;
    -o-transition: margin .25s ease-out;
    transition: margin .25s ease-out;
}
#sidebarDiv .heading {
    padding: 0.875rem 1.25rem;
    font-size: 1.2rem;
}
#sidebarDiv .list {
    width: 15rem;
    padding-left: 0px;
}
#pageDiv {
    min-width: 100vw;
}
#barsDiv.toggled #sidebarDiv {
    margin-left: 0;
}
.list-group-item {
    display: inline-block;
}
li {
    cursor: pointer;
}
@media (min-width: 768px) {
    #sidebarDiv {
        margin-left: 0;
    }
    #pageDiv {
        min-width: 0;
        width: 100%;
    }
    #barsDiv.toggled #sidebarDiv {
        margin-left: -15rem;
    }
}
</style>
