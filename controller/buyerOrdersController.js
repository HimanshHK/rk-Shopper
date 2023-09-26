const buyerOrdersModal = require("../models/buyerOrdersModal");
const ProductModal = require("../models/productModal");
const sellerOrdersModal = require("../models/sellerOrdersModal");
const jwt = require("jsonwebtoken");

// GET Methods
exports.getOrders = async(req, res) => {
  const token=req.body.token;
  console.log(token);
  const decoded =await jwt.verify(token, "Iamasecretkey");
  const orders=await buyerOrdersModal.find({buyerEmail:decoded.username});
  console.log(orders);
  return res.status(200).json({ message: "Orders fetched successfully",orders:orders[0] });
};


exports.getParticularOrder=async(req,res)=>{
  const token=req.body.token;
  const id=req.params.id;
  console.log(token);
  const decoded =await jwt.verify(token, "Iamasecretkey");  
  const orders=await buyerOrdersModal.find({buyerEmail:decoded.username});
  // console.log(orders);
  const arr=orders[0].cartItems;
  const currDate=new Date(id);
  let obj={};
  for(let i=0;i<arr.length;i++){
    // console.log(arr[i].orderDate+" "+currDate);
    // console.log(arr[i].orderDate.getTime()===currDate.getTime());
    if(arr[i].orderDate.getTime()===currDate.getTime()){
      obj=arr[i];
      break;
    }
  }

  console.log(obj)
  return res.status(200).json({ message: "Orders fetched successfully",orders:obj });
}


// exports.getOrdersBuyer = async (req, res) => {
//   try {
//     const orders = await OrdersModal.find({ buyerEmail: req.params.buyerEmail }); 

//     const productIds = orders.map(order => order.cartItems.map(product => product.id)).flat(); 

//     const products = await Promise.all(productIds.map(productId => {
//       return ProductModal.findOne({ _id: productId }); 
//     }));


//     const filteredProducts = products.filter(product => product);

//     const productsWithAdditionalFields = filteredProducts.map(product => {
//       const order = orders.find(order => order.cartItems.some(item => item.id === product._id.toString()));
//       return {
//         ...product.toObject(), 
//         status: order.cartItems.find(item => item.id === product._id.toString()).status,
//         buyerEmail: order.buyerEmail,
//         amount: order.cartItems.find(item => item.id === product._id.toString()).amount,
        
//       };
//     });

//     res.json(productsWithAdditionalFields); 
//   } catch (err) {
//     res.json({ message: err });
//   }
// };




// exports.getOrdersSeller = async (req, res) => {
//   try {
//     const sellerEmail = req.params.sellerEmail;

//     const orders = await OrdersModal.find({"cartItems.seller": sellerEmail}); 

//     const cartItems = orders.flatMap(order => {
      
//       return order.cartItems.filter(item => {
        
//         return item.seller === sellerEmail;
//       }).map(item => {
        
//         return {
//           ...item,
//           oid: order._id,
//           buyerEmail:order.buyerEmail
//         };
//       });
//     });
    
//     console.log(cartItems)
//     res.json(cartItems); 
//   } catch (err) {
//     console.log(err)
//     res.json({ message: err });
//   }
// };

// exports.getOrdersSeller = async (req, res) => {
//   try {
//     const sellerEmail = req.params.sellerEmail;
    
//     const orders = await OrdersModal.find({"cartItems.seller": sellerEmail}); 
//     const cartItems = orders.flatMap(order => { order.cartItems.filter(item => item.seller === sellerEmail)});
    
    
    
//     console.log(cartItems)
//     res.json(cartItems); 
//   } catch (err) {
//     res.json({ message: err });
//   }
// };






// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId, itemId } = req.params; 
//     const {status} = req.body; 
    
 
//     const updatedOrder = await OrdersModal.updateOne(
//       { _id: orderId, 'cartItems.id': itemId }, 
//       { $set: { 'cartItems.$.status': status } },    { new: true } 
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ message: 'Order not found or item not updated' });
//     }
//    console.log(updatedOrder)
//     res.json({ message: 'Item updated successfully', item: updatedOrder.cartItems.find(item => item.id.toString() === itemId) });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to update item' });
//   }
// };





// POST Methods
exports.postOrder = async(req, res) => {
  try{
    //buyer wala
    console.log(req.body);
    const currDate=new Date();
    const token=req.body.passToken;
    console.log(token);
    let arr=[];
    arr=req.body.cartItems;
    const decoded =await jwt.verify(token, "Iamasecretkey");
    let orders=await buyerOrdersModal.findOne({buyerEmail:decoded.username});
    console.log(orders);

    if(orders===null){       
        const objOrder={mobile:req.body.mobile,address:req.body.address,orderDate:currDate,arr};
        const arrOrder=[];
        arrOrder.push(objOrder);
        const order = new buyerOrdersModal({
            buyerEmail: decoded.username,
            cartItems:arrOrder,
        });
        const result=await order.save();
        console.log(result);
        // res.status(200).json({ message: "Order placed successfully" });
    }
    else{
        // const currDate=new Date();
        const objOrder={mobile:req.body.mobile,address:req.body.address,orderDate:currDate,arr};
        const arrOrder=orders.cartItems;
        arrOrder.push(objOrder);

        const result=await orders.save();
        console.log(result);
        // res.status(200).json({ message: "Order placed successfully" });
    }

    //seller wala
    arr=req.body.cartItems;
    for(let i=0;i<arr.length;i++){
      // console.log(arr[i]);
        const emailSeller=arr[i].seller;
        orders=await sellerOrdersModal.findOne({sellerEmail:emailSeller});
        console.log(orders);
        const currOrder=arr[i];
        if(orders===null){
            // const currDate=new Date();
            const objOrder={buyerEmail:decoded.username,mobile:req.body.mobile,address:req.body.address,orderDate:currDate,currOrder};
            const arrOrder=[];
            arrOrder.push(objOrder);
            const order = new sellerOrdersModal({
                sellerEmail: emailSeller,
                orders:arrOrder,
            });
            const result=await order.save();
            console.log(result);
        }
        else{
            // const currDate=new Date(); 
            const objOrder={buyerEmail:decoded.username,mobile:req.body.mobile,address:req.body.address,orderDate:currDate,currOrder};
            const arrOrder=orders.orders;
            arrOrder.push(objOrder);
            const result=await orders.save();
            console.log(result);
        }
        
    }

    return res.status(200).json({ message: "Order placed successfully" });
  }
  catch(error){
    console.error(error);
    return res.status(500).json({ message: "Error retrieving Orders" });
  }

};
