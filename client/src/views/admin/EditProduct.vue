<template>
    <div id="createProduct" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
                <h1>Edit Product</h1>
                <ul class="nav nav-tabs justify-content-center">
                    <li class="nav-item"><a id="mainNavTab" data-toggle="tab" href="#mainTab" class="nav-link active">Main</a></li>
                    <li class="nav-item"><a id="technicalDataNavTab" data-toggle="tab" href="#technicalDataTab" class="nav-link">Technical Data</a></li>
                    <li class="nav-item"><a id="imagesNavTab" data-toggle="tab" href="#imagesTab" class="nav-link">Images</a></li>
                </ul>
                <div class="tab-content">
                    <div id="mainTab" class="tab-pane fade active show">
                        <form autocomplete="off" @submit.prevent="editProduct('main')">
                            <div v-if="edits.productEdited" class="alert alert-success alert-dismissible" role="alert">
                                <div>Product has been successfully edited!</div>
                                <button type="button" class="close" @click="closeEditionAlert()">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <label for="title" class="input-group-text">Title</label>
                                    </div>
                                    <input type="text" id="title" class="form-control" v-model="product.title" ref="first" @focus="clearTitleStatus()" @keypress="clearTitleStatus()"/>
                                </div>
                                <small v-if="errors.titleError && submitting" class="form-text errorInput">Please provide a valid title!</small>
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <label for="description" class="input-group-text">Description</label>
                                    </div>
                                    <textarea id="email" class="form-control" v-model="product.description" @focus="clearDescriptionStatus()" @keypress="clearDescriptionStatus()"/>
                                </div>
                                <small v-if="errors.descriptionError && submitting" class="form-text errorInput">Please provide a valid description!</small>
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
                                <small v-if="errors.priceError && submitting" class="form-text errorInput">Please provide a valid price!</small>
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <label for="quantity" class="input-group-text">Quantity</label>
                                    </div>
                                    <input type="number" id="quantity" class="form-control" v-model="product.quantity" @focus="clearQuantityStatus()" @keypress="clearQuantityStatus()"/>
                                </div>
                                <small v-if="errors.quantityError && submitting" class="form-text errorInput">Please provide a valid quantity!</small>
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
                                <small v-if="errors.categoryError && submitting" class="form-text errorInput">Please provide a valid category!</small>
                            </div>
                            <div class="form-group">
                                <button type="button" class="btn btn-info nextButton" @click="toggleTab('technicalData')">Next <i class="fas fa-angle-double-right"></i></button>
                                <button type="submit" class="btn btn-primary submitButton">Submit <i class="fas fa-check"></i></button>
                            </div>
                        </form>
                    </div>
                    <div id="technicalDataTab" class="tab-pane fade">
                        <form autocomplete="off" @submit.prevent="editProduct('technicalData')">
                            <div class="form-group input-group">
                                <div class="input-group-prepend">
                                    <label for="technicalData" class="input-group-text">Technical Data</label>
                                </div>
                                <select id="technicalData" class="form-control">
                                    <option value="" disabled selected>Select technical information...</option>
                                    <option v-for="technicalInformation in technicalData" :key="technicalInformation._id" :value="technicalInformation.title" :type="technicalInformation.type">{{technicalInformation.title}}</option>
                                </select>
                                <div class="input-group-append">
                                    <button type="button" class="btn btn-primary" @click="selectTechnicalInformation()">Add</button>
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
                                    <tr v-for="(technicalInformation, index) in product.technicalData" :key="technicalInformation.title" :row="technicalInformation.title">
                                        <td>{{index + 1}}</td>
                                        <td>{{technicalInformation.title}}</td>
                                        <td><textarea class="form-control" rows="1" v-model="product.technicalData[index].value"></textarea></td>
                                        <td><i class="fas fa-times fa-2x" @click="removeTechnicalInformation(index)"></i></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="form-group">
                                <button type="button" class="btn btn-info previousButton" @click="toggleTab('main')"><i class="fas fa-angle-double-left"></i> Previous</button>
                                <button type="button" class="btn btn-info nextButton" @click="toggleTab('images')">Next <i class="fas fa-angle-double-right"></i></button>
                                <button type="submit" class="btn btn-primary submitButton">Submit <i class="fas fa-check"></i></button>
                            </div>
                        </form>
                    </div>
                    <div id="imagesTab" class="tab-pane fade">
                        <form autocomplete="off" enctype="multipart/form-data">
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Primary Image</span>
                                    </div>
                                    <div class="custom-file">
                                        <input type="file" id="primaryImage" name="primaryImage" class="custom-file-input" @change="uploadImages($event, 'primaryImage')"/>
                                        <label id="primaryImageLabel" for="primaryImage" class="custom-file-label">Choose image</label>
                                    </div>
                                </div>
                                <small v-if="errors.primaryImageError && submitting" class="form-text errorInput">Please provide a valid primary image!</small>
                            </div>
                            <div id="previewPrimaryImage">
                                <img :src="renderImage(product.primaryImage, 'primaryImage')" :alt="product.primaryImage.name" class="img-fluid rounded" width="100" height="100"/>
                            </div>
                            <h3>Images</h3>
                            <div class="form-group">
                                <div id="dropzone" @dragover.prevent="addDragOver($event)" @dragleave.prevent="removeDragOver($event)" @drop="removeDragOver($event)" @change="uploadImages($event, 'images')">
                                <div id="dropzoneDescription">
                                    <i class="fas fa-upload fa-2x"></i>
                                    <p>Choose more images or drag them here.</p>
                                </div>
                                    <input type="file" id="images" name="images[]" class="images" multiple/>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div v-for="image in product.images" :key="image._id" class="col-md-3">
                                        <img :src="renderImage(image, 'images')" :alt="image.name" class="img-fluid rounded image"/>
                                        <i class="fas fa-times-circle removeImage" @click="deleteImage(image._id, image.name)"></i>
                                    </div>
                                </div>
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
    import helper from "../../components/Helper.vue"; 
	var axios = require("axios");
	
	export default {
		name: "editProduct",
		components: {
            navigation,
			sidebar
        },
        data() {
			return {
                productId: "",
                categories: [],
                technicalData: [],
                submittings: {
                    mainSubmitting: false,
                    imagesSubmitting: false
                },
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
                errors: {
                    titleError: false,
                    descriptionError: false,
                    priceError: false,
                    quantityError: false,
                    categoryError: false,
                    primaryImageError: false,
                    imagesError: false
                },
                edits: {
                    mainEdited: false,
                    technicalDataEdited: false
                }
			}
		},
        methods: {
            getProduct() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getProduct/" + this.productId).then(response => {
                    this.product.title = response.data.product.title;
                    this.product.description = response.data.product.description;
                    this.product.price = helper.methods.createDecimalNumber(response.data.product.price.toString());
                    this.product.quantity = response.data.product.quantity;
                    this.product.category = response.data.product.category;
                    this.product.technicalData = response.data.product.technicalData;
                    this.product.primaryImage = response.data.product.primaryImage;
                    this.product.images = response.data.product.images;
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
            editProduct(type) {
                var allowSubmit = true;
                if(type == "main") {
                    this.submittings.mainSubmitting = true;
                    this.clearTitleStatus();
                    this.clearDescriptionStatus();
                    this.clearPriceStatus();
                    this.clearQuantityStatus();
                    this.clearCategoryStatus();
                    if(this.invalidTitle) {
                        this.errors.titleError = true;
                        allowSubmit = false;
                    }
                    if(this.invalidDescription) {
                        this.errors.descriptionError = true;
                        allowSubmit = false;
                    }
                    if(this.invalidPrice) {
                        this.errors.priceError = true;
                        allowSubmit = false;
                    }
                    if(this.invalidQuantity) {
                        this.errors.quantityError = true;
                        allowSubmit = false;
                    }
                    if(this.invalidCategory) {
                        this.errors.categoryError = true;
                        allowSubmit = false;
                    }
                    if(!allowSubmit) {
                        this.productEdited = false;
                        return;
                    }
                    var body = {productId: this.productId, type: "main", title: this.product.title, description: this.product.description, price: this.product.price, quantity: this.product.quantity, category: this.product.category};
                    axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/editProduct", body).then(response => {
                        if(response.data.edited) {
                            this.productEdited = true;
                            this.errors.titleError = false, this.errors.descriptionError = false, this.errors.priceError = false, this.errors.quantityError = false, this.errors.categoryError = false, this.submittings.mainSubmitting = false;
                        } else {
                            var errorFields = response.data.errorFields;
                            if(errorFields.includes("title")) temp.errors.titleError = true;
                            if(errorFields.includes("description")) temp.errors.descriptionError = true;
                            if(errorFields.includes("price")) temp.errors.priceError = true;
                            if(errorFields.includes("quantity")) temp.errors.quantityError = true;
                            if(errorFields.includes("category")) temp.errors.categoryError = true;
                            this.productEdited = false;
                        }
                    }).catch(error => console.log(error));
                } else if(type == "technicalData") {
                    var body = {productId: this.productId, type: "technicalData", technicalData: JSON.stringify(this.product.technicalData)};
                    axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/editProduct", body).then(response => {
                        if(response.data.edited) {
                            this.productEdited = true;
                        }
                    }).catch(error => console.log(error));
                }
            },
            clearTitleStatus() { this.errors.titleError = false },
            clearDescriptionStatus() { this.errors.descriptionError = false },
            clearPriceStatus() { this.errors.priceError = false },
            clearQuantityStatus() { this.errors.quantityError = false },
            clearCategoryStatus() { this.errors.categoryError = false },
            clearPrimaryImageStatus() { this.errors.primaryImageError = false },
            renderImage(image, type) {
                if(image && !(image instanceof File)) {
                    if(type == "primaryImage") {
                        var imageName = helper.methods.removeDate(image.name);
                        document.getElementById("primaryImageLabel").innerText = imageName;
                    }
                    return "data:" + image.contentType + ";base64," + (new Buffer.from(image.image)).toString("base64");
                } else {
                    return "";
                }
            },
            selectTechnicalInformation() {
                var technicalInformationTitle = document.getElementById("technicalData").value;
                var newTechnicalInformation = {title: technicalInformationTitle, value: ""};
                this.product.technicalData = [...this.product.technicalData, newTechnicalInformation];
                document.getElementById("technicalData").value = "";
            },
            removeTechnicalInformation(currentIndex) {
                this.product.technicalData = this.product.technicalData.filter((technicalInformation, index) => index != currentIndex);
            },
            uploadImages(event, type) {
				//this.clearImagesStatus();
				var files = event.target.files;
                if(files && files.length > 0) {
                    if(type == "primaryImage") {
                        //this.errors.primaryImageError = false;
                        var file = files[0];
                        if(file.type.match("image.*")) {
                            var formData = new FormData();
                            formData.append("productId", this.productId);
                            formData.append("type", "primaryImage");
                            formData.append("primaryImage", file);
                            axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/editProduct", formData).then(response => {
                                if(response.data.edited) {
                                    this.product.primaryImage = response.data.primaryImage;
                                } else {
                                    this.errors.imagesError = true;
                                }
                            }).catch(error => console.log(error));
                        }
                    } else {
                        if((files.length + this.product.images.length) < 11) {
                            var images = [];
                            for(var i = 0, file; file = files[i]; i++) {
                                if (!file.type.match("image.*")) {
                                    continue;
                                }
                                images = [...images, file];
                            }
                            var formData = new FormData();
                            formData.append("productId", this.productId);
                            formData.append("type", "images");
                            for(var image = 0 ; image < images.length; image++) {
                                formData.append("images", images[image]);
                            }
                            axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/editProduct", formData).then(response => {
                                if(response.data.edited) {
                                    for(var image = 0; image < response.data.images.length; image++) {
                                        this.product.images = [...this.product.images, response.data.images[image]];
                                    }
                                } else {
                                    this.errors.imagesError = true;
                                }
                            }).catch(error => console.log(error));
                        } else {
                            this.errors.imagesError = true;
                        }
                    }
                }
			},
            deleteImage(imageId, imageName) {
                var body = {productId: this.productId, imageId: imageId, imageName: imageName};
                axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/deleteProductImage", body).then(response => {
                    if(response.data.deleted) {
                        this.product.images = this.product.images.filter(image => image._id != imageId);
                        this.errors.imagesError = false;
                    } else {
                        this.errors.imagesError = true;
                    }
                }).catch(error => console.log(error));
            },
            addDragOver() {
                document.getElementById("dropzone").className = "onDragOver";
            },
            removeDragOver() {
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
            invalidPrimaryImage() { return validation.methods.invalidPrimaryImage(this.product.primaryImage); },
            invalidImages() { return validation.methods.invalidImages(this.product.images.length); }
        },
        mounted() {
            checkLogin.methods.isLoggedIn();
            this.productId = this.$route.params.productId;
            this.getProduct();
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
	.nextButton {
		float: right;
        margin-left: 5px;
	}
    .submitButton {
        float: right;
    }
    tbody .fas {
        cursor: pointer;
        color: #ff0000;
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
    .image {
        width: 100%;
        height: 150px;
    }
    .removeImage {
        position: absolute;
        top: 0px;
        right: 0px;
        color: #ff0000;
        background-color: #fff;
        cursor: pointer;
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