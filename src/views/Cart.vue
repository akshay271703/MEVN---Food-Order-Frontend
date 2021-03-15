<template>
<h2 class="text-center py-3 bg-success">Invoice </h2>
<div class="mt-5 shadow p-5">
    <div class="grid mb-5">
        <h5>ID</h5>
        <h5>PARTICULARS</h5>
        <h5>PRICE</h5>
        <h5>QUANTITY</h5>
        <h5>TOTAL</h5>
    </div>
    <div v-if="data.length>0">
        <div v-for="item in data" :key="item" class="grid bb-2">
            <p>{{ item.id }}</p>
            <p>{{ item.name }}</p>
            <p>₹ {{ item.price }}</p>
            <p>{{ item.quantity }}</p>
            <p>₹ {{ item.price * item.quantity }}</p>
        </div>
        <div class="text-end mt-3 mx-5">
            <button class="btn btn-warning me-3" @click="showHome()">Add More</button>
            <button class="btn btn-danger" @click="payNow()">Pay Now</button>
        </div>
    </div>
    
</div>


    
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
export default {
    setup(){
        const data = ref([])
        const router = useRouter()
        const res = JSON.parse(sessionStorage.getItem('jft-cart'))
        if(res){
            res.forEach(item=>{
                data.value.push(item)
            })
        }
        const showHome = ()=>{
            router.push({ name : 'Home'})
        }

        const payNow = async()=>{
            data.value.forEach(item=>{
                axios.post(`http://localhost:5000/products/buy/${item.uid}`, {
                    quantity : item.quantity
                  })
                .then(function (response) {
                    if(response.status==404){
                        console.log(`Unable to delete product ${item.name}`)
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
            })

            router.push({ name : 'Home'})
            sessionStorage.removeItem('jft-cart')
        }
        return { data, showHome, payNow }
    }
}
</script>

<style scoped>
    .grid{
        display: grid;
        grid-template-columns: 10% 40% 15% 15% 20%;
    }
    .bb-2{
        border-bottom: 1px solid #ccc;
        margin-bottom: 10px;
    }
    .options{
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>