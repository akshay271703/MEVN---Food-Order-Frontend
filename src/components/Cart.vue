<template>
<div class="cart-body" id="dynamicHeight">
    <div class="cart-contents bg-light">
        <div class="biller">
            <div class="cart-header p-2">
                <h6 class="mt-2">My Cart <span class="smallText"><small>({{ totalItems }} items )</small></span> </h6>
                <button class="btn btn-dark" @click="$emit('showHome')">X</button>
            </div>
            <div class="billing py-2 px-3">
                <div class="row">
                    <div class="col-8">Sub Total</div>
                    <div class="col-4 text-end">{{ payabeAmount }}</div>
                    <div class="col-8">Delivery Charge</div>
                    <div class="col-4 text-end text-danger">+ ₹{{ deliveryCharge }}</div>
                    <hr class="my-2">
                    <div class="col-8">Total Payable</div>
                    <div class="col-4 text-end text-danger">₹{{ payabeAmount + deliveryCharge }}</div>
                </div>
                
            </div>
            <div class="mt-2 p-2 space-between">
                <div v-if="data.length>0">
                    <div v-for="item in data" :key="item" >
                        <div class="row mb-2 bb-2 pb-2">
                            <div class="col-3">
                                <img :src="item.image" alt="" class="img-fluid">
                            </div>
                            <div class="col-5 flex-column custom-flex-1">
                                <h6>{{ item.name }}</h6>
                                <p>{{item.quantity}} * {{ item.price }}</p>
                            </div>
                            <div class="col-4 custom-flex-1">
                                <h6>{{ item.quantity * item.price }}</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="text-end mt-3 mx-5">
            <button class="btn btn-warning me-3" @click="$emit('showHome')">Add More</button>
            <button class="btn btn-danger" @click="payNow()">Pay Now</button>
        </div>
    </div>
</div>

    
</template>

<script>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
export default {
    emits : ['showHome'],
    setup(props, context){
        
        const data = ref([])
        const router = useRouter()
        const res = JSON.parse(sessionStorage.getItem('jft-cart'))
        const payabeAmount = ref(0)
        const totalItems = ref(0)
        const deliveryCharge = ref('')
        const isReloaded = ref(true)
        if(res){
            res.forEach(item=>{
                payabeAmount.value = parseInt(payabeAmount.value) + parseInt(item.quantity * item.price)
                totalItems.value = parseInt(totalItems.value) + parseInt(item.quantity)
                data.value.push(item)
            })
        }
        window.addEventListener('beforeunload', ()=>{
            sessionStorage.removeItem('jft-cart')
        })

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
            setTimeout(()=>{
                context.emit('showHome')
            },300)
            
            sessionStorage.removeItem('jft-cart')
        }

        watchEffect(()=>{
            if(payabeAmount.value>0){
                deliveryCharge.value = Math.floor(Math.random()*70)
            }else{
                deliveryCharge.value = 0
            }
        })
        return { data, payNow, payabeAmount, totalItems, deliveryCharge }
    }
}
</script>

<style scoped>
    .cart-body{
        position: absolute;
        top: 0;
        right: 0;
        max-width: 500px;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        animation: slide 2s linear 0s 1;
    }
    .grid{
        display: grid;
        grid-template-columns: 20% 20% 20% 20% 20%;
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
    .grid-2{
        display: grid;
        grid-template-columns: 80% 20%;
    }
    .cart-contents *{
        z-index: 100;
    }
    .cart-contents{
        background-color: white;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        padding-bottom: 20px;
    }
    @keyframes slide {
        0%{
            transform: translateX(100%);
        }
        100%{
            transform: translateX(0%);
        }
    }
    .cart-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: black;
        color: white;
        border: none;
    }
    .smallText{
        font-size: 15px;
    }
    .test{
        border: 1px solid red;
    }
    .custom-flex-1{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .space-between{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }
</style>