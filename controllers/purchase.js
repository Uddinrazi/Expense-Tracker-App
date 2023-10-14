const Razorpay = require('razorpay');
const Order = require('../models/order')


module.exports.purchase_premium = async(req, res, next) => {
    
    try{
        console.log('hey m in func in pc line no 8')
        
    var rzp = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    })
   // http://localhost:5000/purchase/premium-membership
  
    const amount = 2000;

    rzp.orders.create({amount, currency:'INR'}, async (err, order) => {
        if(err){
            console.log('m in error')
            throw new Error(JSON.stringify(err))
            
        }
        console.log(' func in pc line no 21')
        console.log(order)
       await req.user.createOrder({orderid: order.id, status: 'PENDING'})
            return res.status(201).json({order, key_id: rzp.key_id})
        

    })
}catch(err){
    console.log(err)
    console.log('m in catch error')
    res.status(403).json({message: 'Something went wrong ', error: err})
}
}

module.exports.updateTransactionStatus = async (req, res, next) => {
    try{
        const {payment_id, order_id} = req.body;
        const order = await Order.findOne({where: {orderid : order_id}})
        const promise1 = order.update({paymentid: payment_id, status: 'SUCCESSFULL'})
        const promise2 = req.user.update({ispremium: true})
        
        Promise.all([promise1, promise2]).then(() => {
            return res.status(202).json({success: true, message: ' transaction successfull'})
        }).catch(err => { 
            throw new Error(err)
        })

        if(order_id == undefined){
            const promise3 = order.update({paymentid: payment_id, status: 'FAILED'})
            const promise4 = req.user.update({ispremium: false})

            Promise.all([promise3, promise4]).then(() => {
                return res.status(404).json({success: false, message: ' transaction failed'})
            }).catch(err => { 
                throw new Error(err)
            })
        }
        
    }catch(err){
        if(order_id == undefined){
            const promise3 = order.update({paymentid: payment_id, status: 'FAILED'})
            const promise4 = req.user.update({ispremium: false})

            Promise.all([promise3, promise4]).then(() => {
                return res.status(404).json({success: false, message: ' transaction failed'})
            }).catch(err => { 
                throw new Error(err)
            })
        }
        console.log(err)
    }
}