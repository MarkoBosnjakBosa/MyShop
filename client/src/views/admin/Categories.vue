<template>
    <div id="categories" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
                <div id="categoriesForm">
                    <form autocomplete="off" @submit.prevent="createCategory()">
                        <h1>Categories</h1>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <input type="text" id="title" class="form-control" :class="{'errorField' : titleError && submitting}" placeholder="Title" v-model="category.title" @focus="clearTitleStatus()" @keyPress="clearTitleStatus()"/>
                                <small v-if="titleError && submitting" class="form-text errorInput">Please provide a valid title!</small>
                            </div>
                            <div class="form-group col-md-5">
                                <input type="text" id="icon" class="form-control" :class="{'errorField' : iconError && submitting}" placeholder="Icon" v-model="category.icon" @focus="clearIconStatus()" @keyPress="clearIconStatus()"/>
                                <small v-if="iconError && submitting" class="form-text errorInput">Please provide a valid icon!</small>
                            </div>
                            <div class="form-group col-md-1">
                                <button type="submit" class="btn btn-primary">Create</button>
                            </div>
                        </div>
                        <div v-if="categoryCreated" class="form-group creationSuccessful">Category has been successfully created!</div>
                    </form>
                </div>
                <table id="categoriesTable" class="table">
                    <thead class="thead-light">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Title</th>
                            <th scope="col">Icon</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!categories.length">
                            <td colspan="6" class="noCategories">No categories found!</td>
                        </tr>
                        <tr v-for="(category, index) in categories" :key="category._id">
                            <th scope="row">{{++index}}</th>
                            <td v-if="editing == category._id"><input type="text" class="form-control" v-model="category.title"/></td>
                            <td v-else>{{category.title}}</td>
                            <td v-if="editing == category._id"><input type="text" class="form-control" v-model="category.icon"/></td>
                            <td v-else><i :class="category.icon"></i></td>
                            <td v-if="editing == category._id" class="padded">
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
    import "bootstrap";
	import "bootstrap/dist/css/bootstrap.min.css";
	import checkLogin from "../../components/CheckLogin.vue";
	import navigation from "../../components/Navigation.vue";
	import sidebar from "../../components/Sidebar.vue";
	import validation from "../../components/Validation.vue";
	var axios = require("axios");
	
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
                titleError: false,
                iconError: false,
                category: {
                    title: "",
                    icon: ""
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
                var allowSubmit = true;
                if(this.invalidTitle) {
                    this.titleError = true;
                    allowSubmit = false;
                }
                if(this.invalidIcon) {
                    this.iconError = true;
                    allowSubmit = false;
                }
                if(!allowSubmit) {
                    this.categoryCreated = false;
                    return;
                }
                var body = {title: this.category.title, icon: this.category.icon};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/createCategory", body).then(response => {
                    if(response.data.created) {
                        var newCategory = response.data.category;
                        this.categories = [...this.categories, newCategory];
                        this.categoryCreated = true;
                        this.category = {title: "", icon: ""};
                        this.titleError = false, this.iconError = false, this.submitting = false;
                    } else {
                        var errorFields = response.data.errorFields;
                        if(errorFields.includes("title")) this.titleError = true;
                        if(errorFields.includes("icon")) this.iconError = true;
                        this.categoryCreated = false;
                    }
                }).catch(error => console.log(error));
            },
            enableEditing(category) {
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
                            this.categories = this.categories.map(category => category._id == updatedCategory._id ? updatedCategory : category);
                            this.editing = null;
                        }
                    }).catch(error => console.log(error));
                }
            },
            deleteCategory(categoryId, categoryTitle) {
                var confirmed = confirm("Delete category " + categoryTitle + "!");
                if(confirmed) {
                    axios.delete(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/deleteCategory/" + categoryId).then(response => {
                        if(response.data.deleted) {
                            this.categories = this.categories.filter(category => category._id != categoryId);
                        }
                    }).catch(error => console.log(error));
                }
            },
            clearTitleStatus() { this.titleError = false, this.categoryCreated = false; },
            clearIconStatus() { this.iconError = false, this.categoryCreated = false; },
        },
        computed: {
            invalidTitle() { return validation.methods.invalidTitle(this.category.title); },
            invalidIcon() { return validation.methods.invalidIcon(this.category.icon); }
        },
        created() {
			checkLogin.methods.isLoggedIn();
            this.getCategories();
        }
    }
</script>

<style scoped>
    #categoriesForm, #categoriesTable {
        margin: 0 auto;
        max-width: 900px;
    }
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
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
        padding-top: 20px;
    }
    .editCategory {
        color: #008000;
    }
    .disableEditing {
        color: #ff0000;
    }
    .creationSuccessful {
        color: #008000;
        margin-bottom: 10px;
    }
    .errorField {
        border: 1px solid #ff0000;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
    }
    .errorInput {
        color: #ff0000;
    }
</style>