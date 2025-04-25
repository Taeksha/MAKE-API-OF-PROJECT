const express=require("express")
const connection = require("./db");
const bookrouter = require("./routes/book.route");
const userRouter = require("./routes/user.route");
var cookieParser = require('cookie-parser')

require('dotenv').config()

const app=express()
app.use(cookieParser())
app.set("view engine", "ejs")
app.use(express.json());  


app.use("/books", bookrouter)
app.use("/api/user", userRouter)


app.listen(process.env.PORT ,async()=>{
    try {
        await connection
        console.log("connect to db")
        console.log(`server is runnning on port ${process.env.PORT}`)
        
    } catch (error) {

        console.log("error")
        
    }
})