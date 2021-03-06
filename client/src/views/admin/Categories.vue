<template>
    <div id="categories" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <form autocomplete="off" @submit.prevent="createCategory()" novalidate>
                    <h1>Categories</h1>
                    <div class="row">
                        <div class="mb-3 col-6">
                            <input type="text" id="title" class="form-control" :class="{'errorField' : errors.titleError && submitting}" placeholder="Title" v-model="category.title" @focus="clearTitleStatus()" @keyPress="clearTitleStatus()"/>
                            <small v-if="errors.titleError && submitting" class="form-text errorInput">Please provide a valid title!</small>
                        </div>
                        <div class="mb-3 col-4">
                            <div class="input-group">
                                <input type="text" id="icon" class="form-control" :class="{'errorField' : errors.iconError && submitting}" placeholder="Icon" v-model="category.icon" @focus="clearIconStatus()" @keyPress="clearIconStatus()"/>
                                <span class="input-group-text"><i class="far fa-question-circle" data-toggle="tooltip" title="Use only classes from Font Awesome icons."></i></span>
                            </div>
                            <small v-if="errors.iconError && submitting" class="form-text errorInput">Please provide a valid icon!</small>
                        </div>
                        <div class="mb-3 col-2">
                            <button type="submit" class="btn btn-primary">Create</button>
                        </div>
                    </div>
                    <div v-if="categoryCreated" class="mb-3 categoryCreated">Category has been successfully created!</div>
                </form>
                <table class="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Icon</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!categories.length">
                            <td colspan="4" class="noCategories">No categories found!</td>
                        </tr>
                        <tr v-for="(category, index) in categories" :key="category._id">
                            <th :class="{'padded': editing === category._id}">{{++index}}</th>
                            <td v-if="editing === category._id"><input type="text" class="form-control" v-model="category.title"/></td>
                            <td v-else>{{category.title}}</td>
                            <td v-if="editing === category._id"><input type="text" class="form-control" v-model="category.icon"/></td>
                            <td v-else><i :class="category.icon"></i></td>
                            <td v-if="editing === category._id" class="padded">
                                <i class="far fa-check-circle editCategory" @click="editCategory(category)"></i>
                                <i class="far fa-times-circle disableEditing" @click="disableEditing(category)"></i>
                            </td>
                            <td v-else>
                                <i class="fas fa-pencil-alt" @click="enableEditing(category)"></i>
                                <i class="fas fa-trash" @click="deleteCategory(category._id, category.title)"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div> 
    </div>
</template>

<script>
    import checkLogin from "../../components/CheckLogin.vue";
    import navigation from "../../components/Navigation.vue";
    import sidebar from "../../components/Sidebar.vue";
    import route from "../../components/Route.vue"; 
    import validation from "../../components/Validation.vue";
    const axios = require("axios");
	
    export default {
        name: "categories",
        components: {
            navigation,
            sidebar
        },
        data() {
            return {
                categories: [],
                submitting: false,
                category: {
                    title: "",
                    icon: ""
                },
                errors: {
                    titleError: false,
                    iconError: false,
                },
                categoryCreated: false,
                editing: null
            }
        },
        methods: {
            getCategories() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getCategories").then(response => {
                    this.categories = response.data.categories;
                }).catch(error => console.log(error));
            },
            createCategory() {
                this.submitting = true;
                this.clearTitleStatus();
                this.clearIconStatus();
                var allowCreation = true;
                if(this.invalidTitle) {
                    this.errors.titleError = true;
                    allowCreation = false;
                }
                if(this.invalidIcon) {
                    this.errors.iconError = true;
                    allowCreation = false;
                }
                if(!allowCreation) {
                    this.categoryCreated = false;
                    return;
                }
                var body = {title: this.category.title, icon: this.category.icon};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/createCategory", body).then(response => {
                    if(response.data.created) {
                        var newCategory = response.data.category;
                        this.categories = [...this.categories, newCategory];
                        this.category = {title: "", icon: ""};
                        this.errors = {titleError: false, iconError: false};
                        this.submitting = false;
                        this.categoryCreated = true;
                    } else {
                        var errors = response.data.errors;
                        errors.forEach(element => {
                            this.errors[element + "Error"] = true;
                        });
                        this.categoryCreated = false;
                    }
                }).catch(error => console.log(error));
            },
            enableEditing(category) {
                if(this.editing !== null) return;
                this.cachedCategory = Object.assign({}, category);
                this.editing = category._id;
            },
            disableEditing(category) {
                Object.assign(category, this.cachedCategory);
                this.editing = null;
            },
            editCategory(updatedCategory) {
                if(!validation.methods.invalidTitle(updatedCategory.title) && !validation.methods.invalidIcon(updatedCategory.icon)) {
                    var body = {categoryId: updatedCategory._id, title: updatedCategory.title, icon: updatedCategory.icon};
                    axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/editCategory", body).then(response => {
                        if(response.data.edited) {
                            this.categories = this.categories.map(category => category._id === updatedCategory._id ? updatedCategory : category);
                            this.editing = null;
                        }
                    }).catch(error => console.log(error));
                }
            },
            deleteCategory(categoryId, categoryTitle) {
                var confirmed = confirm("Delete category " + categoryTitle + "?");
                if(confirmed) {
                    axios.delete(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/deleteCategory/" + categoryId).then(response => {
                        if(response.data.deleted) {
                            this.categories = this.categories.filter(category => category._id !== categoryId);
                        }
                    }).catch(error => console.log(error));
                }
            },
            clearTitleStatus() { this.errors.titleError = false, this.categoryCreated = false; },
            clearIconStatus() { this.errors.iconError = false, this.categoryCreated = false; }
        },
        computed: {
            invalidTitle() { return validation.methods.invalidTitle(this.category.title); },
            invalidIcon() { return validation.methods.invalidIcon(this.category.icon); }
        },
        created() {
            var vm = this;
            checkLogin.methods.isLoggedIn(function(isLoggedIn) {
                if(isLoggedIn) {
                    checkLogin.methods.isAdmin(function(isAdmin) {
                        if(isAdmin) vm.getCategories();
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
        max-width: 900px;
    }
    .fa-question-circle {
        cursor: pointer;
    }
    .noCategories {
        font-weight: bold;
        text-align: center;
        margin-top: 20px;
    }
    tbody .fas, tbody .far {
        cursor: pointer;
        margin-right: 5px;
    }
    .padded {
        padding-top: 15px;
    }
    .editCategory {
        color: #008000;
    }
    .disableEditing {
        color: #ff0000;
    }
    .categoryCreated {
        color: #008000;
    }
    .errorField {
        border: 1px solid #ff0000;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
    }
    .errorInput {
        color: #ff0000;
    }
</style>