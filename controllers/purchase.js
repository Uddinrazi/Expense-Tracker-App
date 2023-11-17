const Razorpay = require("razorpay");
const Order = require("../models/order");
const User = require("../models/userM");
const userController = require("./userC");

module.exports.purchase_premium = async (req, res, next) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    var options = {
      amount: 2000, // amount in the smallest currency unit
      currency: "INR",
    };
    req.body.userId = req.user;

    rzp.orders.create(options, async (err, order) => {
      if (err) {
        console.log(err);
        throw new Error(JSON.stringify(err));
      }

      //console.log(order)
      await req.user.createOrder({ orderid: order.id, status: "PENDING" });
      return res.status(201).json({ order, key_id: rzp.key_id });
    });
  } catch (err) {
    console.log(err);
    
    res.status(403).json({ message: "Something went wrong ", error: err });
  }
};



module.exports.updateTransactionStatus = async (req, res, next) => {
  try {
    const { payment_id, order_id } = req.body;
    req.body.userId = req.user.id;
    
    const order = await Order.findOne({ where: { orderid: order_id } });
    const promise1 = order.update({
      paymentid: payment_id,
      status: "SUCCESSFULL",
    });

    const promise2 = User.update(
      { isPremium: true },
      {
        where: {
          id: req.body.userId,
        },
      }
    );

   await Promise.all([promise1, promise2])
      
        const userId = req.user;

        return res.status(202).json({
          success: true,
          message: " transaction successfull",
          token: userController.generateAccessToken(userId, undefined, true),
        });
      }
catch (err) {
    
      Order.update(
        { status: "FAILED" },
        {
          where: {
            orderid: order_id,
          },
        }
      );
      
      User.update({ ispremium: false });
    
    res.status(400).json({ success: false, message: "payment failed " });
    console.log(err);
  }
};



