<template>
    <div id="viewProfile" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <h1>Profile: {{user.account.username}}</h1>
                <div class="nav nav-tabs justify-content-center" role="tablist">
                    <button type="button" id="accountNavTab" data-bs-toggle="tab" data-bs-target="#accountTab" class="nav-link active" role="tab">Account</button>
                    <button type="button" id="addressNavTab" data-bs-toggle="tab" data-bs-target="#addressTab" class="nav-link" role="tab">Address</button>
                    <button type="button" id="deleteNavTab" data-bs-toggle="tab" data-bs-target="#deleteTab" class="nav-link" role="tab">Delete</button>
                </div>
                <div class="tab-content">
                    <div id="accountTab" class="tab-pane fade active show" role="tabpanel">
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">Username:</label>
                            <div class="col-9">
                                <input type="text" id="username" class="form-control" v-model="user.account.username" disabled/>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">Email:</label>
                            <div class="col-9">
                                <input type="text" id="email" class="form-control" v-model="user.account.email" disabled/>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">First name:</label>
                            <div class="col-9">
                                <input type="text" id="firstName" class="form-control" v-model="user.account.firstName" disabled/>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">Last name:</label>
                            <div class="col-9">
                                <input type="text" id="lastName" class="form-control" v-model="user.account.lastName" disabled/>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">Mobile number:</label>
                            <div class="col-9">
                                <div class="input-group">
                                    <span class="input-group-text countryCodePrefix">+</span>
                                    <input type="text" id="mobileNumber" class="form-control" v-model="user.account.mobileNumber" disabled/>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <button type="button" class="btn btn-dark next" @click="toggleTab('address')">Next <i class="fas fa-angle-double-right"></i></button>
                        </div>
                    </div>
                    <div id="addressTab" class="tab-pane fade" role="tabpanel">
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">Street:</label>
                            <div class="col-9">
                                <input type="text" id="street" class="form-control" v-model="user.address.street" disabled/>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">House number:</label>
                            <div class="col-9">
                                <input type="text" id="houseNumber" class="form-control" v-model="user.address.houseNumber" disabled/>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">City:</label>
                            <div class="col-9">
                                <input type="text" id="city" class="form-control" v-model="user.address.city" disabled/>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">ZIP code:</label>
                            <div class="col-9">
                                <input type="text" id="zipCode" class="form-control" v-model="user.address.zipCode" disabled/>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">Country:</label>
                            <div class="col-9">
                                <input type="text" id="country" class="form-control" v-model="user.address.country" disabled/>
                            </div>
                        </div>
                        <div class="mb-3">
                            <button type="button" class="btn btn-dark" @click="toggleTab('account')"><i class="fas fa-angle-double-left"></i> Previous</button>
                            <button type="button" class="btn btn-dark next" @click="toggleTab('delete')">Next <i class="fas fa-angle-double-right"></i></button>
                        </div>
                    </div>
                    <div id="deleteTab" class="tab-pane fade" role="tabpanel">
                        <div class="mb-3 delete">
                            <button type="button" class="btn btn-danger" @click="deleteUser()">Delete <i class="fas fa-trash"></i></button>
                        </div>
                        <div class="mb-3">
                            <button type="button" class="btn btn-dark" @click="toggleTab('address')"><i class="fas fa-angle-double-left"></i> Previous</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import checkLogin from "../../components/CheckLogin.vue";
    import navigation from "../../components/Navigation.vue";
    import sidebar from "../../components/Sidebar.vue";
    import helper from "../../components/Helper.vue";
    import route from "../../components/Route.vue";
    const axios = require("axios");
	
    export default {
        name: "viewProfile",
        components: {
            navigation,
            sidebar
        },
        data() {
            return {
                userId: "",
                user: {
                    account: {
                        username: "",
                        email: "",
                        firstName: "",
                        lastName: "",
                        mobileNumber: ""
                    },
                    address: {
                        street: "",
                        houseNumber: 0,
                        city: "",
                        zipCode: 0,
                        country: ""
                    }
                }
            }
        },
        methods: {
            getUser() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getUserById/" + this.userId).then(response => {
                    this.user.account = response.data.account;
                    this.user.address = response.data.address;
                }).catch(error => route.methods.openPageNotFound());
            },
            deleteUser() {
                var confirmed = confirm("Delete user " + this.user.account.username + "?");
                if(confirmed) {
                    axios.delete(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/deleteUser/" + this.userId).then(response => {
                        if(response.data.deleted) {
                            this.openUsers();
                        }
                    }).catch(error => console.log(error));
                }
            },
            toggleTab(tab) {
                helper.methods.toggleTab(tab);
            },
            openUsers() {
                route.methods.openUsers();
            }
        },
        created() {
            var temp = this;
            checkLogin.methods.isLoggedIn(function(isLoggedIn) {
                if(isLoggedIn) {
                    checkLogin.methods.isAdmin(function(isAdmin) {
                        if(isAdmin) {
                            temp.userId = temp.$route.params.userId;
                            temp.getUser();
                        } else {
                            route.methods.openHome();
                        }
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
    .nav-tabs, #accountTab, #addressTab, #deleteTab {
        margin: auto;
        max-width: 600px;
        margin-top: 20px;
    }
    .countryCodePrefix {
        background-color: #fff;
    }
    .next {
        float: right;
    }
    .delete {
        text-align: center;
    }
</style>