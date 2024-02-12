// backend/routes/user.js
const express = require('express');
const zod  = require("zod");
const jwt = require('jsonwebtoken');
const { User, Account } = require('../dB/db');
const {JWT_SECRET} = require("../config");
const { authMiddleware } = require('../middlewares');

const router = express.Router();
router.use(express.json());

const signupSchema = zod.object({
    username: zod.string(),
    FirstName: zod.string(),
    LastName: zod.string(),
    Age: zod.number(),
    password: zod.string()
})



router.post("/signup",async (req,res)=>{
    const body = req.body;
    

    
  
  const {success} = signupSchema.safeParse(body);
  if (!success) {
    return res.status(411).json({
        msg:"Incorrect inputs"
    })
    
  }

  const existuser = await User.findOne({
    username:body.username
  })

  if (existuser) {
    return res.status(411).json({
        msg:"Email already taken /incorrect inputs"
    })
    
  }

  const user = await User.create({
    username:body.username,
    FirstName:body.FirstName,
    LastName:body.LastName,
    Age:body.Age,
    password:body.password,
  })

  const userId = user._id;

//   create new acc
await Account.create({
    userId,
    balance: 1+Math.random()*10000
})

  const token = jwt.sign({
    userId
  },JWT_SECRET)

  res.json({
    msg:`user created successfully`,
    token:token
  })



    





})

const signinBody = zod.object({
    username: zod.string(),
    password:zod.string()
})

router.post("/signin",async (req,res)=>{
    const {success} =  signinBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            msg:"username already taken/ incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password:req.body.password
    })
    if (user) {
        const token = jwt.sign({
            userId: user._id
        },JWT_SECRET)

        res.json({
            token:token
        })
        console.log("Bearer",token)
        return;
    }
    res.status(411).json({
        message: "Error while logging in"
    })

})

const updateBody = zod.object({
    password: zod.string().optional(),
    FirstName: zod.string().optional(),
    LastName: zod.string().optional()

})

router.put("/update",authMiddleware,async (req,res)=>{
    const {success} = updateBody.safeParse(req.body)
    if(!success){
        res.status(411).json({
            msg:"Error while updating info"
        })
    }

    await User.updateOne(req.body,{
        id: req.userId
    })
    

    res.json({
        msg:"updated info"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            FirstName: {
                "$regex": filter
            }
        }, {
            LastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.FirstName,
            lastName: user.LastName,
            _id: user._id
        }))
    })
})



module.exports = router;