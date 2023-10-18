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

    const amount = 2000;
    req.body.userId = req.user;
    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        //console.log('m in error')
        throw new Error(JSON.stringify(err));
      }

      //console.log(order)
      await Order.create({ orderid: order.id, status: "PENDING" });
      return res.status(201).json({ order, key_id: rzp.key_id });
    });
  } catch (err) {
    console.log(err);
    console.log("m in catch error");
    res.status(403).json({ message: "Something went wrong ", error: err });
  }
};

module.exports.updateTransactionStatus = async (req, res, next) => {
  try {
    const { payment_id, order_id } = req.body;
    req.body.userId = req.user;
    console.log(req.body.userId, "line 42");
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

    Promise.all([promise1, promise2])
      .then(() => {
        const userId = req.user;

        return res
          .status(202)
          .json({
            success: true,
            message: " transaction successfull",
            token: userController.generateAccessToken(userId, undefined, true),
          });
      })
      .catch((err) => {
        throw new Error(err);
      });

    if (payment_id == null || payment_id == undefined ) {
       Order.update(
        { status: 'FSILED' },
        {
          where: {
            orderid: order_id,
          },
        }
      );
      User.update({ ispremium: false })
     }
     res.status(400).json({success:false, message: 'payment failed '})
     /* Promise.all([promise3, promise4])
        .then(() => {
          return res
            .status(404)
            .json({ success: false, message: " transaction failed" });
        })
        .catch((err) => {
          throw new Error(err);
        }); */
    } 
   catch (err) {
   /* const { payment_id, order_id } = req.body
    if (payment_id == null) {
     Order.update(
       { status: 'FSILED' },
       {
         where: {
           orderid: order_id,
         },
       }
     );
     User.update({ ispremium: false })
    
   } */
   
    /*const { payment_id, order_id } = req.body;
    if (order_id == undefined) {
      const promise3 = order.update({
        paymentid: payment_id,
        status: "FAILED",
      });
      const promise4 = req.user.update({ ispremium: false });

      Promise.all([promise3, promise4])
        .then(() => {
          return res
            .status(404)
            .json({ success: false, message: " transaction failed" });
        })
        .catch((err) => {
          throw new Error(err);
        });
    }*/
    console.log(err);
    res.status(400).json({success:false, message: 'payment failed '})
  }
};
