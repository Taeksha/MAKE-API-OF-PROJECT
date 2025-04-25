const {Schema, model}=require("mongoose")

const bookSchema=new Schema({
    Title:String,
    Author:String,
    Price:Number,
    Description:String

   
},{
    versionKey:false,
    timestamps:true
})

const BookModel=model("Book" ,bookSchema)

module.exports=BookModel