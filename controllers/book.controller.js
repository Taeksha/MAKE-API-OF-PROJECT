const { default: axios } = require("axios");
const BookModel = require("../models/book.model");
const connection = require("../db");

//GetAllBooksData

const getBookData = async (req, res) => {
  try {
    const books = await BookModel.find();
    console.log(books)

    return res
      .status(200)
      .json({ message: "Book Added Successfully", data: books});
  } catch (error) {
    res.status(400).json({ massage: error.massage });
  }
};

//AddBookData

const addBookData = async (req, res) => {
  const { Title, Author, Price, Description } = req.body;

  try {
    const isExitBook = await BookModel.findOne({ Title });
    if (isExitBook) {
      return res.status(400).json({ message: "book already exist" });
    }
    await BookModel.create({ Title, Author, Price, Description });

    res.status(200).json({ message: "book added successfully" });
  } catch (error) {
    res.status(400).json({ massage: error.massage });
  }
};

//EditBookData

const editBookData = async(req, res) => {

    try {
        const { id: bookid } = req.params;
        console.log("Deleting book with ID:", bookid);
    
        if (!bookid || bookid.length !== 24) {
          return res.status(400).json({ message: "Invalid book ID" });
        }
    
        updateBook = await BookModel.findByIdAndUpdate( bookid, { $set: { ...req.body} } );

        if (!updateBook) {
          return res.status(404).json({ message: "Book not found" });
        }
        return res.status(200).json({ message: "Book updated successfully", updateBook });
    
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Error updating book", error: error.message });
      }

};

//DeleteBookData


const deleteBookData = async (req, res) => {
  try {
    const { id: bookid } = req.params;
    console.log("Deleting book with ID:", bookid);

    if (!bookid || bookid.length !== 24) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const deletedBook = await BookModel.findByIdAndDelete(bookid);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json({ message: "Book deleted successfully", deletedBook });

  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting book", error: error.message });
  }
};

module.exports = { getBookData, addBookData, editBookData, deleteBookData };
