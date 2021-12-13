<template>
    <div id="notification" class="position-fixed bottom-0 end-0" :class="type == 'success' ? 'p-3' : 'margin'">
        <div class="toast" :class="message ? 'show' : 'hide'" role="alert">
            <div class="toast-header">
                <strong class="me-auto title">{{product.title ? product.title : "Product"}}</strong>
                <button type="button" class="btn-close" @click="hideNotification()"></button>
            </div>
            <div class="toast-body" :class="type">{{message}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "notification",
        props: {
            product: Object,
            message: String,
            type: String
        },
        methods: {
            hideNotification() { this.$emit("hide"); }
        }
    }
</script>

<style scoped>
    .title {
        overflow: hidden;
        white-space: nowrap;
    }
    .toast {
        background-color: #fff;
    }
    .margin {
        margin-bottom: 80px;
    }
    .success {
        color: #008000;
    }
    .error {
        color: #ff0000;
    }
</style>