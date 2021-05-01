<template>
     <div id="homeSettings" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
                <h1>Home Settings</h1>
                <form autocomplete="off" @submit.prevent="saveMessage()">
                    <div class="form-group">
                        <tinymce
                            :api-key="tinyMceEditorApiKey"
                            :init="{
                                height: 500,
                                menubar: 'file edit view insert format tools table help',
                                plugins: ['advlist autolink lists link image charmap print preview anchor', 'searchreplace visualblocks code fullscreen', 'insertdatetime media table paste code help wordcount'],
                                toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
                            }"
                            v-model="message"
                        />
                        <small v-if="messageError" class="form-text errorInput">Please provide a valid message!</small>
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn btn-primary submitButton">Submit</button>
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
    import tinymce from "@tinymce/tinymce-vue";
	var axios = require("axios");

    export default {
        name: "homeSettings",
        components: {
            navigation,
			sidebar,
            tinymce
        },
        data() {
            return {
                tinyMceEditorApiKey: process.env.VUE_APP_TINY_MCE_EDITOR_API_KEY,
                message: "",
                messageError: false
            }
        },
        methods: {
            saveMessage() {
                this.clearMessageStatus();
                if(this.invalidMessage) {
                    this.messageError = true;
                    return;
                }
                var body = {message: this.message};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/saveMessage", body).then(response => {
                    
                }).catch(error => console.log(error));
            },
            clearMessageStatus() { this.messageError = false; }
        },
        computed: {
            invalidMessage() { return validation.methods.invalidMessage(this.message); }
        },
        created() {
			checkLogin.methods.isLoggedIn();
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .submitButton {
		float: right;
	}
    .errorInput {
        color: #ff0000;
    }
</style>