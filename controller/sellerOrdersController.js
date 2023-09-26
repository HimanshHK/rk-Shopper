const sellerOrdersModal = require("../models/sellerOrdersModal");
const ProductModal = require("../models/productModal");
const jwt=require('jsonwebtoken');
const buyerOrdersModal=require('../models/buyerOrdersModal');

// GET Methods
exports.getSellerOrders = async(req, res) => {
    const token=req.body.token;
    console.log(token);
    const decoded =await jwt.verify(token, "Iamasecretkey");
    const orders=await sellerOrdersModal.find({sellerEmail:decoded.username});
    console.log(orders);
    return res.status(200).json({ message: "Orders fetched successfully",orders:orders });

};

// exports.changeOrderStatus=async(req,res)=>{   
//     // console.log(req.body);
//     const token = req.body.token;
    
//     //seller Wala
//     const decoded = await jwt.verify(token, "Iamasecretkey");
//     const seller = await sellerOrdersModal.findOne({ sellerEmail: decoded.username });
//     // console.log(seller);

//     const arrOrders = seller.orders;
//     for (let i = 0; i < arrOrders.length; i++) {
//     if (
//         arrOrders[i].orderDate.getTime() === new Date(req.body.order.orderDate).getTime() &&
//         arrOrders[i].buyerEmail === req.body.order.buyerEmail &&
//         arrOrders[i].currOrder.id === req.body.order.currOrder.id
//     ) {
//         arrOrders[i].currOrder.status = req.body.status;
//         // console.log(arrOrders[i]);
//         try {

//             const filter = { _id: seller._id };
//             const update = {
//               $set: { "orders.$[i].currOrder.status": req.body.status}
//             };
//             const options = {
//               arrayFilters: [
//                 {"i.currOrder.id": req.body.order.currOrder.id ,"i.orderDate": arrOrders[i].orderDate},
//               ]
//             };

//             console.log(filter,update,options);
            
//             const result = await sellerOrdersModal.updateOne(filter,update,options);
//             console.log(result);
//             if (result.nModified === 1) {
//               console.log("Order status updated successfully for seller");
//             } else {
//               console.log("Order not found or not updated");
//             }
            
            

//         console.log("Order status updated successfully for seller");
//         break;
//         } catch (error) {
//         console.error("Error in seller data saving:", error);
//         return res.status(500).json({ message: "Internal server error" });
//         }
//     }
//     }



//     //buyer Wala
//     const buyerEmail=req.body.order.buyerEmail;
//     const ordersbuyer=await buyerOrdersModal.find({buyerEmail:buyerEmail});
//     // console.log(ordersbuyer);
//     const arr=ordersbuyer[0].cartItems;

//     for(let i=0;i<arr.length;i++){
//         if(arr[i].orderDate.getTime()===new Date(req.body.order.orderDate).getTime()){
//             const objArr=arr[i].arr;
//             for(let j=0;j<objArr.length;j++){
//                 console.log(objArr[j].id,req.body.order.currOrder.id);
//                 if(objArr[j].id===req.body.order.currOrder.id){
//                     objArr[j].status=req.body.status;
//                     break;
//                 }
//             }
//             // console.log(objArr);

//             try {
//                 await buyerOrdersModal.findByIdAndUpdate(
//                     ordersbuyer[0]._id,
//                     { $set: { "cartItems.$[i].arr.$[j].status": req.body.status } },
//                     {
//                     arrayFilters: [{ "i.orderDate": arr[i].orderDate }, { "j.id": req.body.order.currOrder.id }],
//                     new: true // To get the updated document
//                     }
//                 );

//                 console.log('Data updated and saved successfully for buyer.');
//             } catch (err) {
//             console.error('Error saving data in buyer:', err);
//             }
//         }

//     }

// }



exports.changeOrderStatus=async(req,res)=>{   
    console.log(req.body);
    const token = req.body.token;
    const decoded = await jwt.verify(token, "Iamasecretkey");
    const seller = await sellerOrdersModal.findOne({ sellerEmail: decoded.username });
    //seller Wala
    try{     
        
        // const arrOrders = seller.orders;
        const filter = { _id: seller._id };
        const update = {
            $set: { "orders.$[i].currOrder.status": req.body.status}
        };
        const options = {
            arrayFilters: [
            {"i.currOrder.id": req.body.order.currOrder.id ,"i.orderDate": new Date(req.body.order.orderDate),"i.buyerEmail":req.body.order.buyerEmail},
            ]
        };

        // console.log(filter,update,options);
        const result = await sellerOrdersModal.updateOne(filter,update,options);
        console.log(result);
    } catch (error) {
        console.error("Error in seller data saving:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
    
    
    //buyer Wala
    try{
        const buyerEmail=req.body.order.buyerEmail;
        const ordersbuyer=await buyerOrdersModal.find({buyerEmail:buyerEmail});
        const result=await buyerOrdersModal.findByIdAndUpdate(
            ordersbuyer[0]._id,
            { $set: { "cartItems.$[i].arr.$[j].status": req.body.status} },
            {
            arrayFilters: [{ "i.orderDate": new Date(req.body.order.orderDate)}, { "j.id": req.body.order.currOrder.id,"j.seller": decoded.username }],
            new: true 
            }
        );
        console.log(result);

        
    } catch (err) {
        console.error('Error saving data in buyer:', err);
    }
}