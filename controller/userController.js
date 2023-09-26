
const UserModal = require("../models/userModal");
const bcrypt = require("bcrypt");
const redis = require("redis");
const client = require("./client.js");
const jwt = require("jsonwebtoken");

// GET Methods
exports.getBlockedUsers = (req, res, next) => {
  return UserModal.find({ blocked: true }).then((user)=>{
    console.log(user);
    if(user.length===0)
    return res.status(401).json({ message: "No user exist"});
    else
    return res.status(200).json({ message: "Logged in", user: user })
  })
};

exports.getUsers = async (req, res, next) => {
  try {
    const data = await UserModal.find()
    res.status(200).json(data);
  }
    catch(err) {
      res.status(404).json({ message: err });
    }
};

exports.getUserById = (req, res, next) => {
  const id = req.params.id;
  // console.log(id, "hi");
  UserModel.findById(id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
};

// POST Methods
exports.postUser = (req, res, next) => {
  
  console.log(req.body); 

  UserModal.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    
    bcrypt.compare(req.body.password, user.password).then((doMatch) => {
      if (doMatch) {
        console.log("user ye hai",user);
        const token = jwt.sign({ id: user._id,"username":req.body.email,"type":user.type }, "Iamasecretkey",{expiresIn: '1d'});
        console.log(token);
        return res.status(200).json({ message: "Logged in", user: user,token:token });
      }
      return res.status(401).json({ message: "Invalid password" });
    }).catch((err) => {
      console.log(err);
      return res.json({ message: err });
    });

  });

};


exports.postUserState = async(req, res, next) => {
    console.log(req.body);
    const decoded =await jwt.verify(req.body.token, "Iamasecretkey"); 
    console.log(decoded.type);
    return res.json({ message: "User exist", type: decoded.type });
};

// exports.postRegister = (req, res, next) => {
//   console.log(req.body);
//   const user = new UserModal({
//     name: req.body.name,
//     password: req.body.password,
//     profilePicUrl: req.file?.path
//       .toString()
//       .replace(/\\/g, "/")
//       .split("shared/")
//       .slice(1)
//       .join(""),
//     email: req.body.email,
//     confirmPassword: req.body.confirmPassword,
//     mobile: req.body.mobile,
//     address: req.body.address,
//     pincode: req.body.pincode,
//     blocked: false,
//     type: req.body.type,
//   });

//   user
//     .save()
//     .then((data) => {
//       console.log(data);
//       res.status(200).json(data);
//     })
//     .catch((err) => {
//       res.status(401).json({ message: err });
//     });
// };

exports.postRegister = (req, res, next) => {
  // console.log(req.body);
  // console.log(req.file);
  
  const user = new UserModal({
    name: req.body.name,
    password: req.body.password,
    profilePicUrl: req.file.path
      .toString()
      .replace(/\\/g, "/"),
    email: req.body.email,
    // confirmPassword: req.body.confirmPassword,
    mobile: req.body.mobile,
    address: req.body.address,
    pincode: req.body.pincode,
    blocked: false,
    type: req.body.type,
  });

  user
    .save()
    .then((data) => {
      console.log(data);
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(401).json({ message: err });
    });

};


exports.postUpdateUser = (req, res, next) => {
  const { password, email, field, newvalue } = req.body;
  UserModal.findOne({email: email}).then((user) => { 
    if (!user) {
        return res.status(403).json({message: "User does not exists"})
    }   
    bcrypt.compare(password, user.password).then((doMatch) => {
      if (doMatch) {
        user.password = password
        user[field] = newvalue;
        user.save().then((result) => {
          console.log(result)
          return res.status(200).json({message: "Field Updated", result: user})
        });
      }
      else{
        return res.status(401).json({message: "Invalid Password"})
      }
      
    }).catch((err) => {
      console.log(err);
      return res.json({ message: err });
    });
    
})

};