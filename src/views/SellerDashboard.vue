<template>
<div class="seller-intro">
    <h1 class="py-3 text-center bg-light">Seller Login</h1>
</div>
<div v-if="data.length>0">
    <div class="cards">
        <div v-for="item in data" :key="item" class="card p-3">
            
            <h5 class="card-title">{{ item.name }}</h5>
            <p class="card-id">{{ item.id }}</p>
            <div class="imageOption">
                <button class="edit-btn">Edit</button>
                <img :src="item.image" alt="" class="img-fluid">
            </div>
            <div class="options">
                <button class="btn btn-danger px-5 my-2" @click="decreaseQty(item)">-</button>
                <button class="card-qty btn btn-outline-success px-5 my-2 currentQuantity">{{ item.quantity }}</button>
                <button class="btn btn-danger px-5 my-2" @click="increaseQty(item)">+</button>
            </div>
            <div>
                <button class="btn btn-success form-control" @click="saveChange(item)">Save</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
export default {
    setup(){
        const data = ref([])
        const fetchData = fetch('http://localhost:5000/products/')
        .then(response => response.json())
        .then(json => {
            json.forEach(item=> {
                data.value.push(item)
            })
        })

        const decreaseQty = (item)=>{
            item.quantity = item.quantity - 1
            item.isChanged = true
            console.log(item.isChanged)
        }

        const increaseQty = (item)=>{
            item.quantity = item.quantity + 1
            item.isChanged = true
        }

        const saveChange = (item)=>{
            // Send Update Request To Backend
            axios.post(`http://localhost:5000/products/edit/${item._id}`, {
                name : item.name,
                quantity: item.quantity,
                price : item.price,
                image : item.image
            })
            .then(function (response) {
                if(response.status!=404){
                    alert('Product Updated')
                    
                }else{
                    alert('Cannot Update the product')
                }
            })
        }

        return { data, increaseQty, decreaseQty, saveChange }
    }
}
</script>

<style scoped>
    .edit-btn{
        position: absolute;
        top: 20%;
        right: 20px;
        width: 80px;
        height: 40px;
        background-color: transparent;
        border: 1px solid white;
        color: white;
    }
    .edit-btn:hover{
        background-color: white;
        color: black;
        transition: all 0.7s ease;
    }
    .cards{
        display: grid;
        grid-template-columns: 30% 30% 30%;
        grid-gap: 1rem;
        justify-content: center;
    }
    .options{
        display: grid;
        grid-template-columns: 30% 30% 30%;
        grid-gap: 1rem;
        justify-content: center;
    }
    @media(max-width:1000px){
        .cards{
            grid-template-columns: 50% 50%;
        }
    }
    @media(max-width:600px){
        .cards{
            grid-template-columns: 100%;
        }
    }
    
</style>