<template>
    <div id="modal" class="modal">
        <span class="close" @click="closeModal()">&times;</span>
        <img id="modalImage" class="modalImage">
    </div>
</template>

<script>
    export default {
        name: "modal",
        methods: {
            openModal(event) {
                var modal = document.getElementById("modal");
                var modalImage = document.getElementById("modalImage");
                modal.style.display = "block";
                modalImage.src = event.target.src;
            },
            closeModal() {
                var modal = document.getElementById("modal");
                modal.style.display = "none";
            }
        }
    }
</script>

<style scoped>
    .modal {
        display: none;
        position: fixed;
        z-index: 1;
        padding-top: 100px;
        padding-bottom: 100px;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: #bfbfbf;
    }
    .modalImage {
        margin: auto;
        display: block;
        width: 80%;
        max-width: 700px;
    }
    .modalImage {
        animation-name: zoom;
        animation-duration: 0.6s;
    }
    .close {
        position: absolute;
        top: 15px;
        right: 35px;
        color: #000;
        font-size: 40px;
        font-weight: bold;
        transition: 0.3s;
        cursor: pointer;
    }
    @keyframes zoom {
        from {transform:scale(0)} 
        to {transform:scale(1)}
    }
    @media only screen and (max-width: 700px) {
        .modalImage {
            width: 100%;
        }
    }
</style>
