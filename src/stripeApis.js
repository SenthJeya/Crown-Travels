import axios from "axios";

const createPaymentIntent = (data) =>{
    return new Promise((resolve,reject)=>{
        axios.post('http://localhost:3000/create-payment-intent',data).then(function(res){
            resolve(res)
        }).catch(function(error){
            reject(error)
        })
    })
}

export default createPaymentIntent;