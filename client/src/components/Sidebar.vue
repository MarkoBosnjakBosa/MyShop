<template>
    <div id="sidebar" class="bg-light border-right">
        <div class="heading">
            <span v-if="userData.isAdmin">MyShop Admin</span>
            <span v-else>MyShop</span>    
        </div>
        <ul v-if="userData.isAdmin" class="list list-group-flush">
            <li class="list-group-item list-group-item-action bg-light" @click="openProducts()">Products</li>
            <li class="list-group-item list-group-item-action bg-light" @click="openCreateProduct()">Create Product</li>
            <li class="list-group-item list-group-item-action bg-light" @click="openCategories()">Categories</li>
            <li class="list-group-item list-group-item-action bg-light" @click="openTechnicalData()">Technical Data</li>
            <li class="list-group-item list-group-item-action bg-light" @click="openOrders()">Orders</li>
            <li class="list-group-item list-group-item-action bg-light" @click="openHomeSettings()">Home Settings</li>
            <li class="list-group-item list-group-item-action bg-light" @click="openContactSettings()">Contact Settings</li>
            <li class="list-group-item list-group-item-action bg-light" @click="openContacts()">Contacts</li>
            <li class="list-group-item list-group-item-action bg-light" @click="openChats()">Chats</li>
            <li class="list-group-item list-group-item-action bg-light" @click="openUsers()">Users</li>
        </ul>
        <ul v-else class="list list-group-flush">
            <li class="list-group-item list-group-item-action bg-light" @click="openShop()"><div class="categoryIcon"><i class="fas fa-search"></i></div>Shop</li>
            <li v-for="category in categories" :key="category._id" class="list-group-item list-group-item-action bg-light" @click="openShopCategory(category._id)"><div class="categoryIcon"><i :class="category.icon"></i></div>{{category.title}}</li>
        </ul>
    </div>
</template>

<script>
    import checkLogin from "../components/CheckLogin.vue";
    import route from "../components/Route.vue";
    const axios = require("axios");

    export default {
        name: "sidebar",
        data() {
            return {
                userData: {
                    isLoggedIn: false,
                    username: "",
                    isAdmin: false
                },
                categories:[]
            }
        },
        methods: {
            getUserData() {
                this.userData = checkLogin.methods.getUserData();
            },
            getCategories() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getCategories").then(response => {
                    this.categories = response.data.categories;
                }).catch(error => console.log(error));
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
            },
            openOrders() {
                route.methods.openOrders();
            },
            openHomeSettings() {
                route.methods.openHomeSettings();
            },
            openContactSettings() {
                route.methods.openContactSettings();
            },
            openContacts() {
                route.methods.openContacts();
            },
            openChats() {
                route.methods.openChats();
            },
            openUsers() {
                route.methods.openUsers();
            },
            openShop() {
                route.methods.openShop();
            },
            openShopCategory(categoryId) {
                route.methods.openShopCategory(categoryId);
            }
        },
        created() {
            this.getUserData();
            if(!this.userData.isAdmin) {
                this.getCategories();
            }
        }
    }
</script>

<style>
    #pageContent {
        overflow-x: hidden;
    }
    #sidebar {
        min-height: 100vh;
        margin-left: -15rem;
        -webkit-transition: margin .25s ease-out;
        -moz-transition: margin .25s ease-out;
        -o-transition: margin .25s ease-out;
        transition: margin .25s ease-out;
    }
    #sidebar .heading {
        padding: 0.875rem 1.25rem;
        font-size: 1.2rem;
    }
    #sidebar .list {
        width: 15rem;
        padding-left: 0px;
    }
    #pageStyle {
        min-width: 100vw;
    }
    #pageContent.toggled #sidebarDiv {
        margin-left: 0;
    }
    .list-group-item {
        display: inline-block;
    }
    li {
        cursor: pointer;
    }
    .categoryIcon {
        float: left;
        width: 10%;
    }
    @media (min-width: 768px) {
        #sidebar {
            margin-left: 0px;
        }
        #pageStyle {
            min-width: 0px;
            width: 100%;
        }
        #pageContent.toggled #sidebar {
            margin-left: -15rem;
        }
    }
</style>
