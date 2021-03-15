const jwt = require('jsonwebtoken')

const maxAge = 24 * 60 * 60
const createToken = (id)=>{
    return jwt.sign({ id }, 'jft-grofer-app', { expiresIn : maxAge } )
}


const checkUser = ()=>{
    const token = sessionStorage.getItem('jft-grofer')
    // console.log(token)
    let status = false
    if(token){
        jwt.verify(token, 'jft-grofer-app', (err,decodedToken)=>{
            if(!err){
                status = true
            }
        })
    }
    return status 
}

export { createToken, checkUser}