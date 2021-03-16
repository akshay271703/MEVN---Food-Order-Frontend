<template>
<!-- <Navbar/> -->
<div class="view-body p-0 m-0">
    <div v-if="warning">
        <Warning  :msg="msg"/>
    </div>
    <div v-if="showCartComponent" class="overlay" id="dynamicHeight">
        <Cart @showHome="showCartComponent=false" />
    </div>
    <!-- <div v-if="showCartComponent">
        <Cart/>
    </div> -->

        <div class="container-fluid" >
        <div class="container">
            <div class="row mt-2 align-items-center">
                <div class="col-2">
                    <h2>Grofers JFT</h2>
                </div>
                <div class="col-lg-8 col-md-6 col-sm-4"></div>
                <div class="col-lg-2 col-md-4 col-sm-6">
                    <div v-if="isLoggedIn">
                        <div class="row"> 
                            <div class="col-6">
                                <button class="btn btn-dark form-control" @click="showCart()"><i class="fas fa-shopping-cart"></i></button>
                                <div class="item-in-cart">
                                    <p>{{ productsInCarts }}</p>
                                </div>
                                
                            </div>
                            <div class="col-6">
                                <button class="btn btn-outline-danger form-control" @click="logout()">Log Out</button>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div class="row">
                            <div class="col-12">
                                <button class="btn btn-outline-success form-control" @click="showLogIn()">Log In</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="my-5" >
        <div v-if="data.length>0" class="wrapper">
            <div v-for="item in data" :key="item" class="product shadow p-3" :class="{ 'bg-sold-out': item.quantity<1 }">
                <h5>Product Id - {{ item.id }}</h5>
                <p>{{ item.name }}</p>
                <img :src="item.image" alt="" class="img-fluid">
                <div class="row mt-3 align-items-center">
                    <div class="col-4">
                        <button class=" btn btn-dark form-control">₹ {{ item.price}}</button>
                    </div>
                    <div class="col-4">
                        <div v-if="item.quantity>5">
                            <button class="btn btn-success form-control">{{ item.quantity }} left</button>
                        </div>
                        <div v-else-if="item.quantity>=1">
                            <button class="btn btn-danger form-control">{{ item.quantity }} left</button>
                        </div>
                        <div v-else>
                            <button class="btn btn-danger form-control">Sold Out</button>
                        </div>
                    </div>
                    <div class="col-4">
                        <button class="btn btn-danger form-control" @click="addToCart(item)">Add</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

</template>

<script>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { checkUser } from '../composables/jwt.js'
import Warning from '../components/Warning.vue'
import Cart from '../components/Cart.vue'
export default {
    components : { Warning, Cart },
    setup(){
        const data = ref([])
        const router = useRouter()
        const cartData = ref([])
        const warning = ref(false)
        const showCartComponent = ref(false)
        const msg = ref('')
        const productsInCarts = ref(0)
        // Navbar Variables
        const isLoggedIn = ref(false)
        const showLogIn = ()=>{
            router.push({ name : 'Login'})
        }
        const logout = ()=>{
            sessionStorage.removeItem('jft-grofer')
            sessionStorage.removeItem('jft-cart')
            isLoggedIn.value = false
            router.push({ name : 'Home'})
        }
        watchEffect(()=>{
            if(sessionStorage.getItem('jft-grofer')){
                isLoggedIn.value = true
            }else{
                sessionStorage.removeItem('jft-cart')
                isLoggedIn.value = false
            }
        })

        //Fetch All Available Products
        const fetchData = fetch('http://localhost:5000/products/')
            .then(response => response.json())
            .then(json => {
                json.forEach(item=> {
                    data.value.push(item)
                })
            })

        const addToCart = (item)=>{
            if(checkLogged()){
                if(item.quantity>0){
                    let newData = {
                        uid : item._id,
                        id : item.id,
                        quantity : 1,
                        price : item.price,
                        name : item.name,
                        image : item.image
                    }
                    let found = false
                    cartData.value.forEach(cartItem =>{
                        if(cartItem.id  == item.id){
                            cartItem.quantity = cartItem.quantity + 1
                            found = true
                        }
                    })
                    if(!found){
                        cartData.value.push(newData)
                    }
                    item.quantity = item.quantity-1
                    productsInCarts.value = parseInt(productsInCarts.value) + 1
                    sessionStorage.setItem('jft-cart',  JSON.stringify(cartData.value))
                }
            }
        }

        const checkLogged = ()=>{
            if(checkUser()){
                return true
            }else{
                msg.value = "You need to be logged in First"
                warning.value = true
                setTimeout(()=>{
                    warning.value = false
                    router.push({  name : "Login"})
                },2000)
            }
        }

        const showCart = ()=>{
            // router.push({ name : 'Cart'})
            showCartComponent.value = true
        }

        return { data, addToCart, checkUser, cartData, isLoggedIn, showLogIn, logout, checkLogged, warning, msg, showCart, showCartComponent, productsInCarts }
    }
}
</script>

<style scoped>
template{
    margin: 0;
}
.bg-sold-out{
    background-color: #ccc;
}
    .wrapper{
        display: grid;
        grid-template-columns: 30% 30% 30%;
        grid-gap:2rem;
        justify-content: center;
    }
    @media(max-width:1200px){
        .wrapper{
            grid-template-columns: 45% 45%;
        }
    }
    @media(max-width:600px){
        .wrapper{
            grid-template-columns: 100%;
        }
    }
    .btn:focus{
        outline: none;
        box-shadow: none;
    }
    .overlay{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.7);
    }
    .item-in-cart{
        position: relative;
        top: -60%;
        left: 55%;
        padding: 9px;
        background-color: rgb(224, 108, 66);
        color: white;
        width: 20px;
        height: 20px;
        border-radius: 50%;
    }
    .item-in-cart p{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>