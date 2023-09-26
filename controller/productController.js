const ProductModal = require("../models/productModal");
const redis = require("redis");
const jwt=require('jsonwebtoken');

require('./client')
const { clearHash } = require('./client')
// GET Methods
exports.getProducts = async (req, res) => {
  try {
      const data = await ProductModal.find().cache();
      // console.log(data);
      res.status(200).json((data)); 
        
    }
    catch (err) {
    console.log(err);
    res.status(404).json({ message: err });
  }
};


exports.getPartProducts = async (req, res) => {
  try {
      const id=req.params.id;
      console.log(id);
      let data=[];

      if(id==="fruits")
      data = await ProductModal.find({ $or: [{ category: "dairy" }, { category: "fruits" }] }).cache();
      else 
      data = await ProductModal.find({category:id}).cache();

      res.status(200).json((data));    
    }
    catch (err) {
    console.log(err);
    res.status(404).json({ message: err });
  }
};


exports.getSellerProducts = (req, res) => {
  const seller = req.params.seller;
  console.log(seller);
  ProductModal.find({ seller: seller })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
};

exports.deleteProduct = (req, res) => {
  console.log(req.body.id);
  clearHash('default')
  ProductModal.deleteOne({ _id: req.body.id })
    .then((product) => {
      if (!product) {
        return res.status(403).json({ message: "Product does not exist" });
      }
      return res
        .status(201)
        .json({ message: "Product has been deleted!!!", result: product });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
};

exports.getProduct = (req, res) => {
  const id = req.params.id;
  ProductModal.findById(id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
};


// POST Methods
exports.postProduct = (req, res) => {
  console.log(req.file);
  console.log(req.body);
  clearHash('default');

  const token=req.body.token;
  console.log(token);
  const decoded =jwt.verify(token, "Iamasecretkey");
  console.log(decoded.username);

  const product = new ProductModal({
    name: req.body.productName,
    price: parseInt(req.body.price),
    description: req.body.productDesc,
    image: req.file?.path
        .toString()
        .replace(/\\/g, "/"),
    category: req.body.category,
    company: req.body.company,
    seller: decoded.username,
    stock: parseInt(req.body.stock),
    stars: Math.random() * 2 + 3,
    reviews: Math.floor(Math.random(100)),
  });


  product
    .save()
    .then((result) =>
      res
        .status(200)
        .json({ message: "Product has been added", result: result })
    )
    .catch((err) => {
      res.status(403).json({ message: err });
    });
};

exports.postRemoveProduct = (req, res) => {
  clearHash('default')
  const id = req.body.id;
  ProductModal.findByIdAndDelete(id)
    .then(() => {
      res.status(200).json({ message: "Product has been deleted" });
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
};

exports.postLoadProductsOfUser = (req, res) => {
  const comp = req.body.company;
  ProductModal.find({ company: comp })
    .then((resData) => {
      res
        .status(200)
        .json({ message: "Your Products has been loaded", data: resData });
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
};