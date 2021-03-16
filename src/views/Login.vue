<template>
<div v-if="showWarning">
    <Warning :msg="msg" />
</div>
<div class="form-wrapper mt-5">
    <div class="body p-5 shadow">
        <h2 class="my-3" v-if="choice">Customer Login</h2>
        <h2 class="my-3" v-else>Seller Login</h2>
        <form @submit.prevent="logIn()">
            <div class="form-group">
                <label>Email</label>
                <input type="email" placeholder="Email" class="form-control mb-3" v-model="email">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" placeholder="Email" class="form-control" v-model="password">
            </div>
            <div class="form-group mt-3">
                <button class="btn btn-success">Login</button>
            </div>
        </form>
    </div>
    <div class="d-flex">
        <button class="btn btn-outline-dark mt-3" @click="loadHome()">Go Back</button>
        <button class="btn btn-outline-dark mt-3" @click="loadsignup()">Signup</button>
    </div>  
</div>
<div class="text-center mt-3">
    <button class="btn btn-light" @click="choice = false" v-if="choice">Switch to seller login</button>
    <button class="btn btn-light" @click="choice = true" v-else>Switch to customer login</button>
</div>
    
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { createToken } from '../composables/jwt.js'
import Warning from '../components/Warning.vue'
export default {
    components : { Warning },
    setup(){
        const choice  = ref(true)
        const email = ref('')
        const password = ref('')
        const showWarning = ref(false)
        const msg = ref('')
        const router = useRouter()
        const loadHome = ()=>{
            router.push({ name : 'Home'})
        }
        const loadsignup = ()=>{
            router.push({ name : 'Signup'})
        }
        const logIn = async ()=>{
            if(choice.value){
                customerLogin()
            }else{
                sellerLogin()
            }
        }

        const customerLogin = ()=>{
            console.log(process.env.BASE_URL)
            axios.post('http://localhost:5000/login', {
                email: email.value,
                password: password.value
            })
            .then(function (response) {
                if(response.status!=404){
                    const token = createToken(response.data)
                    sessionStorage.setItem('jft-grofer', token)
                    // document.cookie = `jft-grofer=${token}`
                    msg.value = "Log In Successful"
                    showWarning.value = true
                    setTimeout(()=>{
                        showWarning.value = false
                        router.push({ name : 'Home'})
                    }, 2000)
                }else{
                    alert('Cannot log you in')
                }
            })
        }

        const sellerLogin = ()=>{
            if(email.value === 'seller@grofer.com' && password.value === 'seller'){
                router.push({ name : 'SellerDashboard'})
            }else{
                alert('Invalid Credentials')
                email.value = ''
                password.value = ''
            }
            
        }

        return { choice, loadHome, loadsignup, logIn, email, password, customerLogin, sellerLogin, showWarning, msg }
    }
}
</script>

<style scoped>
.form-wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.body{
    width: 500px;
}
</style>