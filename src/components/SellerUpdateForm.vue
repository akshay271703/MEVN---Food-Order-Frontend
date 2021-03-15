<template>
    <h4 class="text-center">Update Product - {{ product.id }}</h4>
    <div class="mt-5">
        <form>
            <div class="form-group">

            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    props : ['productID'],
    setup(){
        axios.post('http://localhost:5000/products/one/')
    }
}
</script>

<style>

</style>