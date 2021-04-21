<template>
    <div id="createProduct" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
                <form autocomplete="off" enctype="multipart/form-data" @submit.prevent="createProduct()">
                    <h1>Create Product</h1>
                    <ul class="nav nav-tabs justify-content-center">
                        <li class="nav-item"><a id="mainNavTab" data-toggle="tab" href="#mainTab" class="nav-link active">Main</a></li>
                        <li class="nav-item"><a id="technicalDataNavTab" data-toggle="tab" href="#technicalDataTab" class="nav-link">Technical Data</a></li>
                        <li class="nav-item"><a id="imagesNavTab" data-toggle="tab" href="#imagesTab" class="nav-link">Images</a></li>
                    </ul>
                    <div class="tab-content">
                        <div id="mainTab" class="tab-pane fade active show">
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <label for="title" class="input-group-text">Title</label>
                                    </div>
                                    <input type="text" id="title" class="form-control" v-model="product.title" ref="first" @focus="clearTitleStatus()" @keypress="clearTitleStatus()"/>
                                </div>
                                <small v-if="titleError && submitting" class="form-text errorInput">Please provide a valid title!</small>
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <label for="description" class="input-group-text">Description</label>
                                    </div>
                                    <textarea id="email" class="form-control" v-model="product.description" @focus="clearDescriptionStatus()" @keypress="clearDescriptionStatus()"/>
                                </div>
                                <small v-if="descriptionError && submitting" class="form-text errorInput">Please provide a valid description!</small>
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <label for="price" class="input-group-text">Price</label>
                                    </div>
                                    <input type="text" id="price" class="form-control" v-model="product.price" @focus="clearPriceStatus()" @keypress="clearPriceStatus()"/>
                                    <div class="input-group-append">
                                        <span class="input-group-text">.00</span>
                                    </div>
                                </div>
                                <small v-if="priceError && submitting" class="form-text errorInput">Please provide a valid price!</small>
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <label for="quantity" class="input-group-text">Quantity</label>
                                    </div>
                                    <input type="number" id="quantity" class="form-control" v-model="product.quantity" @focus="clearQuantityStatus()" @keypress="clearQuantityStatus()"/>
                                </div>
                                <small v-if="quantityError && submitting" class="form-text errorInput">Please provide a valid quantity!</small>
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <label for="category" class="input-group-text">Category</label>
                                    </div>
                                    <select id="category" class="form-control" v-model="product.category" @focus="clearCategoryStatus()" @keypress="clearCategoryStatus()">
                                        <option value="" disabled selected>Select category...</option>
                                        <option v-for="category in categories" :key="category._id" :value="category._id">{{category.title}}</option>
                                    </select>
                                </div>
                                <small v-if="categoryError && submitting" class="form-text errorInput">Please provide a valid category!</small>
                            </div>
                            <div class="form-group">
                                <button type="button" class="btn btn-info nextButton" @click="toggleTab('technicalData')">Next <i class="fas fa-angle-double-right"></i></button>
                            </div>
                        </div>
                        <div id="technicalDataTab" class="tab-pane fade">
                            <div class="form-group input-group">
                                <div class="input-group-prepend">
                                    <label for="technicalData" class="input-group-text">Technical Data</label>
                                </div>
                                <select id="technicalData" class="form-control">
                                    <option v-for="technicalInformation in technicalData" :key="technicalInformation._id" :value="technicalInformation.title" :type="technicalInformation.type">{{technicalInformation.title}}</option>
                                </select>
                                <div class="input-group-append">
                                    <button type="button" class="btn btn-primary" @click="selectTechnicalData()">Add</button>
                                </div>
                            </div>
                            <table v-if="product.technicalData.length" id="selectedTechnicalData" class="table">
                                <thead class="thead-light">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Title</th>
                                        <th scope="col">Value</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(technicalInformation, index) in product.technicalData" :key="technicalInformation.title">
                                        <td>{{index + 1}}</td>
                                        <td>{{technicalInformation.title}}</td>
                                        <td><textarea class="form-control" rows="1"></textarea></td>
                                        <td><i class="fas fa-times fa-2x" @click="removeTechnicalInformation(index)"></i></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="form-group">
                                <button type="button" class="btn btn-info previousButton" @click="toggleTab('main')"><i class="fas fa-angle-double-left"></i> Previous</button>
                                <button type="button" class="btn btn-info nextButton" @click="toggleTab('images')">Next <i class="fas fa-angle-double-right"></i></button>
                            </div>
                        </div>
                        <div id="imagesTab" class="tab-pane fade">
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Primary Image</span>
                                    </div>
                                    <div class="custom-file">
                                        <input type="file" id="primaryImage" name="primaryImage" class="custom-file-input" @change="selectImages($event, 'primaryImage')"/>
                                        <label for="primaryImage" class="custom-file-label">Choose image</label>
                                    </div>
                                </div>
                                <small v-if="primaryImageError && submitting" class="form-text errorInput">Please provide a valid primary image!</small>
                            </div>
                            <div id="previewPrimaryImage"></div>
                            <h3>Images</h3>
                            <div class="form-group">
                                <div id="dropzone" @dragover.prevent="addDragOver($event)" @dragleave.prevent="removeDragOver($event)" @drop="removeDragOver($event)" @change="selectImages($event, 'images')">
                                <div id="dropzoneDescription">
                                    <i class="fas fa-upload fa-2x"></i>
                                    <p>Choose more images or drag them here.</p>
                                </div>
                                    <input type="file" id="images" name="images[]" class="images" multiple/>
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
                                    <tr v-for="(image, index) in product.images" :key="image.name">
                                        <td>{{index + 1}}</td>
                                        <td>{{image.name}}</td>
                                        <td><img :src="image.src" :alt="image.name" class="img-fluid rounded" width="100" height="100"/></td>
                                        <td><button type="button" class="btn btn-danger" @click="removeImage(index)">Delete</button></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="form-group">
                                <button type="button" class="btn btn-info previousButton" @click="toggleTab('technicalData')"><i class="fas fa-angle-double-left"></i> Previous</button>
						        <button type="submit" class="btn btn-primary submitButton">Submit <i class="fas fa-check"></i></button>
                            </div>
                        </div>
                    </div>
                </form>
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
    import helper from "../../components/Helper.vue"; 
	var axios = require("axios");
	
	export default {
		name: "createProduct",
		components: {
            navigation,
			sidebar
        },
        data() {
			return {
                categories: [],
                technicalData: [],
                submitting: false,
                titleError: false,
                descriptionError: false,
                priceError: false,
                quantityError: false,
                categoryError: false,
                primaryImageError: false,
                product: {
                    title: "",
                    description: "",
                    price: "",
                    quantity: "",
                    category: "",
                    technicalData: [],
                    primaryImage: "",
                    images: []
                },
                productCreated: false,
                editing: null
			}
		},
        methods: {
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
            createProduct() {
                this.submitting = true;
                this.clearTitleStatus();
                this.clearDescriptionStatus();
                this.clearPriceStatus();
                this.clearQuantityStatus();
                this.clearCategoryStatus();
                this.clearPrimaryImageStatus();
                var allowSubmit = true;
                if(this.invalidTitle) {
                    this.titleError = true;
                    allowSubmit = false;
                }
                if(this.invalidDescription) {
                    this.descriptionError = true;
                    allowSubmit = false;
                }
                if(this.invalidPrice) {
                    this.priceError = true;
                    allowSubmit = false;
                }
                if(this.invalidQuantity) {
                    this.quantityError = true;
                    allowSubmit = false;
                }
                if(this.invalidCategory) {
                    this.categoryError = true;
                    allowSubmit = false;
                }
                if(this.invalidPrimaryImage) {
                    this.primaryImageError = true;
                    allowSubmit = false;
                }
                if(!allowSubmit) {
                    this.productCreated = false;
                    return;
                }
                var body = {title: this.category.title, icon: this.category.icon};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/createProduct", body).then(response => {
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
            clearTitleStatus() { this.titleError = false },
            clearDescriptionStatus() { this.descriptionError = false },
            clearPriceStatus() { this.priceError = false },
            clearQuantityStatus() { this.quantityError = false },
            clearCategoryStatus() { this.categoryError = false },
            clearPrimaryImageStatus() { this.primaryImageError = false },
            selectTechnicalData() {
                var technicalInformationTitle = document.getElementById("technicalData").value;
                var newTechnicalInformation = {title: technicalInformationTitle};
                this.product.technicalData = [...this.product.technicalData, newTechnicalInformation];
                document.getElementById("technicalData").value = "";
            },
            removeTechnicalInformation(currentIndex) {
                this.product.technicalData = this.product.technicalData.filter((technicalInformation, index) => index != currentIndex);
            },
            selectImages(event, type) {
				var files = event.target.files;
                var temp = this;
                if(files && files.length > 0) {
                    if(type == "primaryImage") {
                        var file = files[0];
                        var fileReader = new FileReader();
                        fileReader.onload = function(e) {
                            var previewPrimaryImage = document.getElementById("previewPrimaryImage");
                            previewPrimaryImage.innerHTML = "<img src='" + e.target.result + "' class='rounded mx-auto d-block' alt='" + file.name + "'/>";
                        }
                        this.product.primaryImage = file;
                        document.getElementById("dropzone").classList.remove("onDragOver");
					    this.clearPrimaryImageStatus();
                        fileReader.readAsDataURL(file);
                    } else {
                        for (var i = 0, file; file = files[i]; i++) {
                            if (!file.type.match("image.*")) {
                                continue;
                            }
                            var fileReader = new FileReader();
                            fileReader.onload = (function(theFile) {
                                return function(e) {
                                    var newImage = {name: theFile.name, src: e.target.result, file: theFile};
                                    temp.product.images = [...temp.product.images, newImage];
                                };
                            })(file);
                            fileReader.readAsDataURL(file);
                        }
                    }
                }
			},
            removeImage(currentIndex) {
                this.product.images = this.product.images.filter((image, index) => index != currentIndex);
            },
            addDragOver(event) {
                document.getElementById("dropzone").className = "onDragOver";
            },
            removeDragOver(event) {
                document.getElementById("dropzone").classList.remove("onDragOver");
            },
            toggleTab(tab) {
                helper.methods.toggleTab(tab);
			}
        },
        computed: {
            invalidTitle() { return validation.methods.invalidTitle(this.product.title); },
            invalidDescription() { return validation.methods.invalidDescription(this.product.description); },
            invalidPrice() { return validation.methods.invalidPrice(this.product.price); },
            invalidQuantity() { return validation.methods.invalidQuantity(this.product.quantity); },
            invalidCategory() { return validation.methods.invalidCategory(this.product.category); },
            invalidPrimaryImage() { return validation.methods.invalidPrimaryImage(this.product.primaryImage); }
        },
        created() {
			checkLogin.methods.isLoggedIn();
            this.getCategories();
            this.getTechnicalData();
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    #mainTab, #technicalDataTab, #imagesTab {
        margin: 0 auto;
        max-width: 800px;
        margin-top: 20px;
    }
    #previewPrimaryImage {
		text-align: center;
		margin-bottom: 10px;
	}
    .previousButton {
		float: left;
	}
	.nextButton, .submitButton {
		float: right;
	}
    tbody .fas {
        cursor: pointer;
        color: #ff0000;;
    }
    #dropzone {
        border: 2px dashed #91b0b3;
        color: #92b0b3;
        position: relative;
        height: 150px;
    }
    #dropzoneDescription {
        position: absolute;
        margin: 0 auto;
        left: 0;
        right: 0;
        text-align: center;
        width: 40%;
        top: 50px;
        font-size: 16px;
    }
    #images, #images:focus {
        position: absolute;
        outline: none !important;
        width: 100%;
        height: 150px;
        cursor: pointer;
        opacity: 0;
    }
    #dropzone:hover, #dropzone.onDragOver {
        background: #ecf0f5;
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