const ProductModal = require("../models/productModal");
const wishlistModal = require("../models/wishListModal");
const jwt = require("jsonwebtoken");

// GET Methods
exports.getWishList = async(req, res) => {
    console.log(req.body);
    try{
        const token=req.body.token;
        const decoded =await jwt.verify(token, "Iamasecretkey");
        const wishlist=await wishlistModal.findOne({buyerEmail:decoded.username});
        if(wishlist===null){
            return res.status(200).json({ message: "No product exist in wishlist" });
        }else{
            const arr=wishlist.wishList;
            const products=await ProductModal.find({_id:{$in:arr}});
            return res.status(200).json({ message: "Product fetched from wishlist",products:products });
        }
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: "Error fetching wishlist" });
    }
};


// POST Methods
exports.postWishlist = async (req, res) => {
    try{
        console.log(req.body);
        const id = req.body.id;
        const token = req.body.token;
        const decoded = await jwt.verify(token, "Iamasecretkey");
        console.log(decoded);
        const wishlist=await wishlistModal.findOne({buyerEmail:decoded.username});
        console.log(wishlist);
        if(wishlist===null){
            const arr=[];
            arr.push(id);
            const wishlist = new wishlistModal({
                buyerEmail: decoded.username,
                wishList:arr,
            });

            const result=await wishlist.save();
            console.log(result);
            return res.status(200).json({ message: "Product added to wishlist" });
        }else{
            const arr=wishlist.wishList;
            let flag=0;
            for(let i=0;i<arr.length;i++){
                if(arr[i]===id){
                    flag=1;
                    return res.status(200).json({ message: "Product already exist in wishlist" });
                }
            }
            if(flag===0){
                arr.push(id);
                wishlist.wishList=arr;
                const result=await wishlist.save();
                console.log(result);
                return res.status(200).json({ message: "Product added to wishlist" });
            }
        }

    }catch(error){
        console.error(error);
        return res.status(500).json({ message: "Error adding product to wishlist" });
    }
    
};
