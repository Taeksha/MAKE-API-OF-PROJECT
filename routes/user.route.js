const express=require("express")
const userController = require("../controllers/user.controller")





const userRouter=express.Router()

//sign up
userRouter.post("/signup", userController.signup)

//verify
userRouter.post("/verify",userController.verify )


//sign in
userRouter.post("/signin",userController.signin )    


module.exports=userRouter