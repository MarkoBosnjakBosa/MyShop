<template>
    <div id="products" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
                <h1>Products</h1>
                <ul class="nav nav-tabs">
					<li class="nav-item"><a data-toggle="tab" href="#overviewTab" class="nav-link active">Overview</a></li>
					<li class="nav-item"><a data-toggle="tab" href="#createProductTab" class="nav-link">Create Product</a></li>
				</ul>
                <div class="tab-content">
					<div id="overviewTab" class="tab-pane fade active show">
					</div>
					<div id="createProductTab" class="tab-pane fade">
                        <form autocomplete="off" @submit.prevent="createCategory()" enctype="multipart/form-data">
                            <div class="form-group row">
                                <label for="title" class="col-md-2 col-form-label">Title:</label>
                                <div class="col-md-10">
                                    <input type="text" id="title" class="form-control" :class="{'errorField' : titleError && submitting}" v-model="product.title" ref="first" @focus="clearTitleStatus()" @keypress="clearTitleStatus()"/>
                                    <small v-if="titleError && submitting" class="form-text errorInput">Please provide a valid title!</small>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="description" class="col-md-2 col-form-label">Description:</label>
                                <div class="col-md-10">
                                    <textarea id="email" class="form-control" :class="{'errorField' : descriptionError && submitting}" v-model="product.description" @focus="clearDescriptionStatus()" @keypress="clearDescriptionStatus()"/>
                                    <small v-if="descriptionError && submitting" class="form-text errorInput">Please provide a valid description!</small>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="price" class="col-md-2 col-form-label">Price:</label>
                                <div class="col-md-10">
                                    <input type="text" id="price" class="form-control" :class="{'errorField' : priceError && submitting}" v-model="product.price" @focus="clearPriceStatus()" @keypress="clearPriceStatus()"/>
                                    <small v-if="priceError && submitting" class="form-text errorInput">Please provide a valid price!</small>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="quantity" class="col-md-2 col-form-label">Quantity:</label>
                                <div class="col-md-10">
                                    <input type="number" id="quantity" class="form-control" :class="{'errorField' : quantityError && submitting}" v-model="product.quantity" @focus="clearQuantityStatus()" @keypress="clearQuantityStatus()"/>
                                    <small v-if="quantityError && submitting" class="form-text errorInput">Please provide a valid quantity!</small>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="category" class="col-md-2 col-form-label">Category:</label>
                                <div class="col-md-10">
                                    <select id="category" class="form-control" :class="{'errorField' : categoryError && submitting}" v-model="product.category" @focus="clearCategoryStatus()" @keypress="clearCategoryStatus()">
                                        <option value="" disabled selected>Select category...</option>
                                        <option v-for="category in categories" :key="category._id" :value="category._id">{{category.title}}</option>
                                    </select>
                                    <small v-if="categoryError && submitting" class="form-text errorInput">Please provide a valid category!</small>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="technicalData" class="col-md-2 col-form-label">Technical Data:</label>
                                <div class="col-md-10">
                                    <select id="technicalData" class="form-control" v-model="product.category">
                                        <option v-for="technicalInformation in technicalData" :key="technicalInformation._id" :value="technicalInformation._id">{{technicalInformation.title}}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Upload</span>
                                    </div>
                                    <div class="custom-file">
                                        <input type="file" id="images" name="images[]" class="custom-file-input" @change="selectImages($event)" multiple/>
                                        <label id="imagesLabel" for="images" class="custom-file-label">Choose files</label>
                                    </div>
                                </div>
                                <table v-if="product.images.length" id="previewImages" class="table">
                                    <thead class="thead-light">
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Image</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="image in product.images" :key="image.index">
                                            <td>{{image.index}}</td>
                                            <td>{{image.name}}</td>
                                            <td><img :src="image.src" :alt="image.name" class="img-fluid rounded" width="100" height="100"/></td>
                                            <td><button type="button" class="btn btn-danger" @click="removeImage(image.index)">Delete</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </form>
                    </div>	
                </div>
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
		name: "products",
		components: {
            navigation,
			sidebar
        },
        data() {
			return {
                products: [],
                categories: [],
                technicalData: [],
                submitting: false,
                titleError: false,
                descriptionError: false,
                priceError: false,
                quantityError: false,
                product: {
                    title: "",
                    description: "",
                    price: "",
                    quantity: "",
                    category: "",
                    technicalData: [],
                    images: []
                },
                productCreated: false,
                editing: null
			}
		},
        methods: {
            getProducts() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getProducts").then(response => {
                    this.products = response.data.products;
                }).catch(error => console.log(error));
            },
            getCategories() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getCategories").then(response => {
                    this.categories = response.data.categories;
                }).catch(error => console.log(error));
            },
            getTechnicalData() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getTechnicalData").then(response => {
                    this.technicalData = response.data.technicalData;
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
            selectImages(event) {
				var files = event.target.files;
                var temp = this;
                var index = 0;
				for (var i = 0, file; file = files[i]; i++) {
                    if (!file.type.match('image.*')) {
                        continue;
                    }
                    var reader = new FileReader();
                    reader.onload = (function(theFile) {
                        return function(e) {
                            index++;
                            var newImage = {index: index, name: theFile.name, src: e.target.result, file: theFile};
                            temp.product.images = [...temp.product.images, newImage];
                        };
                    })(file);
                    reader.readAsDataURL(file);
                }
                document.getElementById("imagesLabel").innerHTML = files.length + " images selected";
			},
            removeImage(index) {
                this.product.images = this.product.images.filter(image => image.index != index);
                var index = 0;
                for(var i = 0; i < this.product.images.length; i++) {
                    index++;
                    this.product.images[i].index = index;
                }
                document.getElementById("imagesLabel").innerHTML = index + " images selected";
            }
        },
        computed: {
            invalidTitle() { return validation.methods.invalidTitle(this.category.title); },
            invalidIcon() { return validation.methods.invalidIcon(this.category.icon); }
        },
        created() {
			checkLogin.methods.isLoggedIn();
            this.getProducts();
            this.getCategories();
            this.getTechnicalData();
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
    .noProducts {
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
    .editProduct {
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