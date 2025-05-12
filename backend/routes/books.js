import express from "express"
import Book from "../models/Book.js"
import { auth } from "../middleware/auth.js"

const router = express.Router()

// Get all books for the current user
router.get("/", auth, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({ success: true, books })
  } catch (error) {
    console.error("Get books error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// Get a single book
router.get("/:id", auth, async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, user: req.user._id })

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" })
    }

    res.json({ success: true, book })
  } catch (error) {
    console.error("Get book error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// Create a new book
router.post("/", auth, async (req, res) => {
  try {
    const { title, author, isbn, year, description, cover, status } = req.body

    const newBook = new Book({
      title,
      author,
      isbn,
      year,
      description,
      cover,
      status,
      user: req.user._id,
    })

    const book = await newBook.save()
    res.status(201).json({ success: true, book })
  } catch (error) {
    console.error("Create book error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// Update a book
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, author, isbn, year, description, cover, status } = req.body

    // Find book and check ownership
    const book = await Book.findOne({ _id: req.params.id, user: req.user._id })

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" })
    }

    // Update fields
    book.title = title || book.title
    book.author = author || book.author
    book.isbn = isbn
    book.year = year
    book.description = description
    book.cover = cover
    book.status = status || book.status

    await book.save()
    res.json({ success: true, book })
  } catch (error) {
    console.error("Update book error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// Delete a book
router.delete("/:id", auth, async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, user: req.user._id })

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" })
    }

    await book.deleteOne()
    res.json({ success: true, message: "Book removed" })
  } catch (error) {
    console.error("Delete book error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

export default router
