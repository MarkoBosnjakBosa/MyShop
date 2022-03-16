<template>
    <div id="users" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <h1>Users</h1>
                <form autocomplete="off" @submit.prevent="getUsers()" novalidate>
                    <div class="row">
                        <div class="mb-3 col-4">
                            <input type="text" id="search" class="form-control" placeholder="Search..." v-model="search"/>
                        </div>
                        <div class="mb-3 col-2">
                            <input type="number" id="limit" min="1" class="form-control" v-model="limit"/>
                        </div>
                        <div class="mb-3 col-2">
                            <select id="orderBy" class="form-control" v-model="orderBy">
                                <option value="" selected>Order by</option>
                                <option value="usernameAsc">Username &#129045;</option>
                                <option value="usernameDesc">Username &#129047;</option>
                                <option value="emailAsc">Email &#129045;</option>
                                <option value="emailDesc">Email &#129047;</option>
                            </select>
                        </div>
                        <div class="btn-group mb-3 col-2">
                            <button type="submit" class="btn btn-primary">Search</button>
                            <button type="button" class="btn btn-dark" data-toggle="tooltip" :title="'Total: ' + total">{{total}}</button>
                        </div>
                    </div>
                </form>
                <table class="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Mobile number</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!users.length">
                            <td colspan="6" class="noUsers">No users found!</td>
                        </tr>
                        <tr v-for="(user, index) in users" :key="user._id">
                            <th>{{++index}}</th>
                            <td>{{user.account.firstName + " " + user.account.lastName}}</td>
                            <td>{{user.account.username}}</td>
                            <td>{{user.account.email}}</td>
                            <td>+{{user.account.mobileNumber}}</td>
                            <td>
                                <i class="fas fa-external-link-square-alt" @click="openViewProfile(user._id)"></i>
                                <i class="fas fa-trash" @click="deleteUser(user._id, user.account.username)"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="mb-3 pages">
                    <button v-if="page - 1 > 0" type="button" class="btn btn-dark page" @click="loadPage(page - 1)"><i class="fas fa-angle-double-left"></i></button>
                    <button type="button" class="btn btn-dark page">{{page}}</button>
                    <button v-if="page < pagesNumber" type="button" class="btn btn-dark page" @click="loadPage(page + 1)"><i class="fas fa-angle-double-right"></i></button>
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
    const axios = require("axios");
	
    export default {
        name: "users",
        components: {
            navigation,
            sidebar
        },
        data() {
            return {
                users: [],
                search: "",
                page: 1,
                limit: 10,
                orderBy: "",
                total: 0,
                pagesNumber: 1
            }
        },
        methods: {
            getUsers() {
                if(!Number.isInteger(this.limit) || this.limit < 1) this.limit = 1;
                var body = {search: this.search, page: this.page, limit: this.limit, orderBy: this.orderBy};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getUsers", body).then(response => {
                    this.users = response.data.users;
                    this.total = response.data.total;
                    this.pagesNumber = response.data.pagesNumber;
                }).catch(error => console.log(error));
            },
            deleteUser(userId, username) {
                var confirmed = confirm("Delete user " + username + "?");
                if(confirmed) {
                    axios.delete(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/deleteUser/" + userId).then(response => {
                        this.users = this.users.filter(user => user._id !== userId);
                        this.total = this.total - 1; 
                    }).catch(error => console.log(error));
                }
            },
            loadPage(page) {
                if(page > 0) {
                    this.page = page;
                    this.getUsers();
                }
            },
            openViewProfile(userId) {
                route.methods.openViewProfile(userId);
            }
        },
        created() {
            var temp = this;
            checkLogin.methods.isLoggedIn(function(isLoggedIn) {
                if(isLoggedIn) {
                    checkLogin.methods.isAdmin(function(isAdmin) {
                        if(isAdmin) temp.getUsers();
                        else route.methods.openHome();
                    });
                } else {
                    route.methods.openLogin();
                }
            });
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    form, table {
        margin: auto;
        max-width: 1000px;
    }
    .noUsers {
        font-weight: bold;
        text-align: center;
        margin-top: 20px;
    }
    tbody .fas {
        margin-right: 5px;
        cursor: pointer;
    }
    .pages {
        text-align: center;
    }
    .page {
        margin-left: 10px;
        margin-top: 10px;
    }
</style>