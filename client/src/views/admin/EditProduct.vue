<template>
    <div id="editProduct" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <h1>Edit product: {{product.title}}</h1>
                <div class="nav nav-tabs justify-content-center" role="tablist">
                    <button type="button" id="mainNavTab" data-bs-toggle="tab" data-bs-target="#mainTab" class="nav-link active" role="tab">Main</button>
                    <button type="button" id="technicalDataNavTab" data-bs-toggle="tab" data-bs-target="#technicalDataTab" class="nav-link" role="tab">Technical Data</button>
                    <button type="button" id="imagesNavTab" data-bs-toggle="tab" data-bs-target="#imagesTab" class="nav-link" role="tab">Images</button>
                    <button type="button" id="deleteNavTab" data-bs-toggle="tab" data-bs-target="#deleteTab" class="nav-link" role="tab">Delete</button>
                </div>
                <div class="tab-content">
                    <div id="mainTab" class="tab-pane fade active show" role="tabpanel">
                        <form autocomplete="off" @submit.prevent="editProduct('main')" novalidate>
                            <div v-if="edits.mainEdited" class="alert alert-success alert-dismissible" role="alert">
                                <div>Product has been successfully edited!</div>
                                <button type="button" class="btn-close" @click="closeEditAlert('main')"></button>
                            </div>
                            <div class="mb-3">
                                <div class="input-group">
                                    <label for="title" class="input-group-text">Title</label>
                                    <input type="text" id="title" class="form-control" :class="{'errorField' : errors.titleError && submittings.mainSubmitting}" v-model="product.title" @focus="clearTitleStatus()" @keypress="clearTitleStatus()"/>
                                </div>
                                <small v-if="errors.titleError && submittings.mainSubmitting" class="form-text errorInput">Please provide a valid title!</small>
                            </div>
                            <div class="mb-3">
                                <div class="input-group">
                                    <label for="description" class="input-group-text">Description</label>
                                    <textarea id="description" class="form-control" :class="{'errorField' : errors.descriptionError && submittings.mainSubmitting}" v-model="product.description" @focus="clearDescriptionStatus()" @keypress="clearDescriptionStatus()"/>
                                </div>
                                <small v-if="errors.descriptionError && submittings.mainSubmitting" class="form-text errorInput">Please provide a valid description!</small>
                            </div>
                            <div class="mb-3">
                                <div class="input-group">
                                    <label for="price" class="input-group-text">Price</label>
                                    <input type="text" id="price" class="form-control" :class="{'errorField' : errors.priceError && submittings.mainSubmitting}" v-model="product.price" @focus="clearPriceStatus()" @keypress="clearPriceStatus()"/>
                                    <span class="input-group-text">0.00 €</span>
                                </div>
                                <small v-if="errors.priceError && submittings.mainSubmitting" class="form-text errorInput">Please provide a valid price!</small>
                            </div>
                            <div class="mb-3">
                                <div class="input-group">
                                    <label for="quantity" class="input-group-text">Quantity</label>
                                    <input type="number" id="quantity" min="1" class="form-control" :class="{'errorField' : errors.quantityError && submittings.mainSubmitting}" v-model="product.quantity" @focus="clearQuantityStatus()" @keypress="clearQuantityStatus()"/>
                                </div>
                                <small v-if="errors.quantityError && submittings.mainSubmitting" class="form-text errorInput">Please provide a valid quantity!</small>
                            </div>
                            <div class="mb-3">
                                <div class="input-group">
                                    <label for="category" class="input-group-text">Category</label>
                                    <select id="category" class="form-control" :class="{'errorField' : errors.categoryError && submittings.mainSubmitting}" v-model="product.category" @focus="clearCategoryStatus()" @keypress="clearCategoryStatus()">
                                        <option value="" selected disabled>Select category...</option>
                                        <option v-for="category in categories" :key="category._id" :value="category._id">{{category.title}}</option>
                                    </select>
                                </div>
                                <small v-if="errors.categoryError && submittings.mainSubmitting" class="form-text errorInput">Please provide a valid category!</small>
                            </div>
                            <div>
                                <button type="button" class="btn btn-dark nextButton" @click="toggleTab('technicalData')">Next <i class="fas fa-angle-double-right"></i></button>
                                <button type="submit" class="btn btn-primary submitButton">Submit <i class="fas fa-check"></i></button>
                            </div>
                        </form>
                    </div>
                    <div id="technicalDataTab" class="tab-pane fade" role="tabpanel">
                        <form autocomplete="off" @submit.prevent="editProduct('technicalData')">
                            <div v-if="edits.technicalDataEdited" class="alert alert-success alert-dismissible" role="alert">
                                <div>Product has been successfully edited!</div>
                                <button type="button" class="btn-close" @click="closeEditAlert('technicalData')"></button>
                            </div>
                            <div class="mb-3 input-group">
                                <label for="technicalData" class="input-group-text">Technical data</label>
                                <select id="technicalData" class="form-control">
                                    <option value="" selected disabled>Select technical information...</option>
                                    <option v-for="technicalInformation in technicalData" :key="technicalInformation._id" :value="technicalInformation.title" :type="technicalInformation.type">{{technicalInformation.title}}</option>
                                </select>
                                <button type="button" class="btn btn-primary" @click="selectTechnicalInformation()">Add</button>
                            </div>
                            <table v-if="product.technicalData.length" class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Title</th>
                                        <th>Value</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(technicalInformation, index) in product.technicalData" :key="technicalInformation.title" :row="technicalInformation.title">
                                        <th class="padded">{{index + 1}}</th>
                                        <td class="padded">{{technicalInformation.title}}</td>
                                        <td><textarea rows="1" class="form-control" v-model="product.technicalData[index].value"></textarea></td>
                                        <td class="padded"><i class="fas fa-times fa-2x" @click="removeTechnicalInformation(index)"></i></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div>
                                <button type="button" class="btn btn-dark" @click="toggleTab('main')"><i class="fas fa-angle-double-left"></i> Previous</button>
                                <button type="button" class="btn btn-dark nextButton" @click="toggleTab('images')">Next <i class="fas fa-angle-double-right"></i></button>
                                <button type="submit" class="btn btn-primary submitButton">Submit <i class="fas fa-check"></i></button>
                            </div>
                        </form>
                        <notification :product="product" :message="message" :type="'error'" @hide="hideNotification()"></notification>
                    </div>
                    <div id="imagesTab" class="tab-pane fade" role="tabpanel">
                        <form autocomplete="off" enctype="multipart/form-data">
                            <div class="mb-3">
                                <div class="input-group">
                                    <span for="primaryImage" class="input-group-text">Primary image</span>
                                    <input type="file" id="primaryImage" name="primaryImage" class="form-control" :class="{'errorField' : errors.primaryImageError}" @change="uploadImages($event, 'primaryImage')"/>
                                </div>
                                <small v-if="errors.primaryImageError" class="form-text errorInput">Please provide a valid primary image!</small>
                            </div>
                            <div id="previewPrimaryImage" class="mb-3">
                                <img :src="renderImage(product.primaryImage)" :alt="product.primaryImage.name" class="img-fluid rounded" style="height: 150px; weight: 150px;"/>
                            </div>
                            <h3>Images</h3>
                            <div class="mb-3">
                                <div id="dropzone" @dragover.prevent="addDragOver()" @dragleave.prevent="removeDragOver()" @drop="removeDragOver()" @change="uploadImages($event, 'images')">
                                    <div id="dropzoneDescription">
                                        <i class="fas fa-upload fa-2x"></i>
                                        <p>Choose more images or drag them here.</p>
                                    </div>
                                    <input type="file" id="images" name="images[]" class="images" multiple/>
                                </div>
                                <small v-if="errors.imagesError" class="form-text errorInput">Please provide less than 5 valid images!</small>
                            </div>
                            <div class="mb-3">
                                <div class="row">
                                    <div v-for="image in product.images" :key="image._id" class="col-md-3 position">
                                        <img :src="renderImage(image)" :alt="image.name" class="img-fluid rounded image"/>
                                        <i class="fas fa-times-circle removeImage" @click="deleteImage(image._id, image.name)"></i>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="btn btn-dark" @click="toggleTab('technicalData')"><i class="fas fa-angle-double-left"></i> Previous</button>
                                <button type="button" class="btn btn-dark nextButton" @click="toggleTab('delete')">Next <i class="fas fa-angle-double-right"></i></button>
                            </div>
                        </form>
                    </div>
                    <div id="deleteTab" class="tab-pane fade" role="tabpanel">
                        <div class="mb-3">
                            <button type="button" class="btn btn-danger" @click="deleteProduct()">Delete <i class="fas fa-trash"></i></button>
                        </div>
                        <div>
                            <button type="button" class="btn btn-dark" @click="toggleTab('images')"><i class="fas fa-angle-double-left"></i> Previous</button>
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
    import validation from "../../components/Validation.vue";
    import notification from "../../components/Notification.vue";
    const axios = require("axios");
	
    export default {
        name: "editProduct",
        components: {
            navigation,
            sidebar,
            notification
        },
        data() {
            return {
                productId: "",
                categories: [],
                technicalData: [],
                product: {
                    title: "",
                    description: "",
                    price: "",
                    quantity: 1,
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
                submittings: {
                    mainSubmitting: false,
                    imagesSubmitting: false
                },
                edits: {
                    mainEdited: false,
                    technicalDataEdited: false
                },
                message: ""
            }
        },
        methods: {
            getProduct() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getProduct/" + this.productId).then(response => {
                    this.product = response.data.product;
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
                var allowEdit = true;
                if(type == "main") {
                    this.submittings.mainSubmitting = true;
                    this.clearTitleStatus();
                    this.clearDescriptionStatus();
                    this.clearPriceStatus();
                    this.clearQuantityStatus();
                    this.clearCategoryStatus();
                    if(this.invalidTitle) {
                        this.errors.titleError = true;
                        allowEdit = false;
                    }
                    if(this.invalidDescription) {
                        this.errors.descriptionError = true;
                        allowEdit = false;
                    }
                    if(this.invalidPrice) {
                        this.errors.priceError = true;
                        allowEdit = false;
                    }
                    if(this.invalidQuantity) {
                        this.errors.quantityError = true;
                        allowEdit = false;
                    }
                    if(this.invalidCategory) {
                        this.errors.categoryError = true;
                        allowEdit = false;
                    }
                    if(!allowEdit) {
                        this.edits.mainEdited = false;
                        return;
                    }
                    var body = {productId: this.productId, type: "main", title: this.product.title, description: this.product.description, price: this.product.price, quantity: this.product.quantity, category: this.product.category};
                    axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/editProduct", body).then(response => {
                        if(response.data.edited) {
                            this.errors = {titleError: false, descriptionError: false, priceError: false, quantityError: false, categoryError: false};
                            this.submittings.mainSubmitting = false;
                            this.edits.mainEdited = true;
                        } else {
                            var errorFields = response.data.errorFields;
                            if(errorFields.includes("title")) this.errors.titleError = true;
                            if(errorFields.includes("description")) this.errors.descriptionError = true;
                            if(errorFields.includes("price")) this.errors.priceError = true;
                            if(errorFields.includes("quantity")) this.errors.quantityError = true;
                            if(errorFields.includes("category")) this.errors.categoryError = true;
                            this.edits.mainEdited = false;
                        }
                    }).catch(error => console.log(error));
                } else if(type == "technicalData") {
                    var body = {productId: this.productId, type: "technicalData", technicalData: JSON.stringify(this.product.technicalData)};
                    axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/editProduct", body).then(response => {
                        if(response.data.edited) {
                            this.edits.technicalDataEdited = true;
                        }
                    }).catch(error => console.log(error));
                }
            },
            selectTechnicalInformation() {
                var technicalInformationTitle = document.getElementById("technicalData").value;
                if(technicalInformationTitle != "") {
                    if(document.getElementsByTagName("tbody")[0]) {
                        var rows = document.getElementsByTagName("tbody")[0].rows;
                        for(var row = 0; row < rows.length; row++) {
                            if(rows[row].cells[1].innerText == technicalInformationTitle) {
                                this.message = "You have already selected the technical information!";
                                return;
                            }
                        }
                    }
                    var newTechnicalInformation = {title: technicalInformationTitle, value: ""};
                    this.product.technicalData = [...this.product.technicalData, newTechnicalInformation];
                    document.getElementById("technicalData").value = "";
                }
            },
            removeTechnicalInformation(currentIndex) {
                this.product.technicalData = this.product.technicalData.filter((technicalInformation, index) => index != currentIndex);
            },
            uploadImages(event, type) {
                var files = event.target.files;
                if(files && files.length > 0) {
                    if(type == "primaryImage") {
                        this.errors.primaryImageError = false;
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
                                    this.errors.primaryImageError = true;
                                }
                            }).catch(error => console.log(error));
                        } else {
                            this.errors.primaryImageError = true;
                        }
                    } else {
                        this.errors.imagesError = false;
                        if((files.length + this.product.images.length) < 5) {
                            var images = [];
                            for(var i = 0, file; file = files[i]; i++) {
                                if (!file.type.match("image.*")) {
                                    continue;
                                }
                                images = [...images, file];
                            }
                            if(images.length > 0) {
                                var formData = new FormData();
                                formData.append("productId", this.productId);
                                formData.append("type", "images");
                                for(var image = 0; image < images.length; image++) {
                                    formData.append("images", images[image]);
                                }
                                axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/editProduct", formData).then(response => {
                                    if(response.data.edited) {
                                        this.product.images = [];
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
                        } else {
                            this.errors.imagesError = true;
                        }
                    }
                }
            },
            deleteImage(imageId, imageName) {
                var confirmed = confirm("Delete this image?");
                if(confirmed) {
                    var body = {productId: this.productId, imageId: imageId, imageName: imageName};
                    axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/deleteProductImage", body).then(response => {
                        if(response.data.deleted) {
                            this.product.images = this.product.images.filter(image => image._id != imageId);
                            this.errors.imagesError = false;
                        } else {
                            this.errors.imagesError = true;
                        }
                    }).catch(error => console.log(error));
                }
            },
            deleteProduct() {
                var confirmed = confirm("Delete this product?");
                if(confirmed) {
                    axios.delete(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/deleteProduct/" + this.productId).then(response => {
                        route.methods.openProducts();
                    }).catch(error => console.log(error));
                }
            },
            addDragOver() {
                document.getElementById("dropzone").className = "onDragOver";
            },
            removeDragOver() {
                document.getElementById("dropzone").classList.remove("onDragOver");
            },
            hideNotification() {
                this.message = "";
            },
            closeEditAlert(type) { 
                if(type == "main") this.edits.mainEdited = false;
                else this.edits.technicalDataEdited = false;
            },
            renderImage(image) { return helper.methods.renderImage(image); },
            toggleTab(tab) { helper.methods.toggleTab(tab); },
            clearTitleStatus() { this.errors.titleError = false },
            clearDescriptionStatus() { this.errors.descriptionError = false },
            clearPriceStatus() { this.errors.priceError = false },
            clearQuantityStatus() { this.errors.quantityError = false },
            clearCategoryStatus() { this.errors.categoryError = false }
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
        created() {
            checkLogin.methods.isLoggedIn();
            checkLogin.methods.isAdmin();
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
    #mainTab, #technicalDataTab, #imagesTab, #deleteTab {
        margin: auto;
        max-width: 800px;
        margin-top: 20px;
    }
    .padded {
        padding-top: 12px;
    }
    #deleteTab {
        text-align: center;
    }
    #previewPrimaryImage {
        text-align: center;
        margin-bottom: 10px;
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
        margin-bottom: 10px;
    }
    .removeImage {
        position: absolute;
        top: 0px;
        right: -5px;
        color: #ff0000;
        background-color: #fff;
        cursor: pointer;
    }
    #dropzone:hover, #dropzone.onDragOver {
        background: #ecf0f5;
    }
    .position {
        position: relative;
    }
    .errorField {
        border: 1px solid #ff0000;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
    }
    .errorInput {
        color: #ff0000;
    }
</style>