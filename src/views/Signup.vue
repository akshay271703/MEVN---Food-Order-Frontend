<template>
<div class="form-wrapper mt-5">
    <div class="body p-5 shadow">
        <h2 class="my-3">Signup</h2>
        <form @submit.prevent="handleSignup()">
            <div class="form-group">
                <label>Email</label>
                <input type="email" placeholder="Email" class="form-control mb-3" v-model="email">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" placeholder="Email" class="form-control mb-3" v-model="password">
            </div>
            <div class="form-group">
                <label>Confirm Password</label>
                <input type="password" placeholder="Email" class="form-control" v-model="password2">
            </div>
            <div class="form-group mt-3">
                <button class="btn btn-success">Sign Up</button>
            </div>
            
        </form>
        
    </div>
    <button class="btn btn-outline-dark mt-3" @click="loadHome()">Go Back</button>
</div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createToken } from '../composables/jwt.js'
import axios from 'axios'
export default {
    setup(){
        const router = useRouter()
        const email = ref('')
        const password = ref('')
        const password2 = ref('')
        const jwtToken = ref('')
        const handleSignup = async ()=>{

            axios.post('http://localhost:5000/signup', {
                email: email.value,
                password: password.value
            })
            .then(function (response) {
                if(response.status!=404){
                    const token = createToken(response.data)
                    sessionStorage.setItem('jft-grofer', token)
                    router.push({ name : 'Home'})
                }
            })
            
        }

        const loadHome = ()=>{
            router.push({ name : 'Home'})
        }

        return { email, password, password2, handleSignup, loadHome, jwtToken}
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