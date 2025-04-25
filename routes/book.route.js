const express=require("express")
const { getBookData, addBookData, editBookData, deleteBookData } = require("../controllers/book.controller")
const auth = require("../middleware/auth")



const bookrouter=express.Router()

//sign up
bookrouter.get("/get",auth,  getBookData)


//sign in
bookrouter.post("/add", auth, addBookData)    

bookrouter.patch("/edit/:id", editBookData)


bookrouter.delete("/delete/:id", deleteBookData)   

module.exports=bookrouter