import mongoose from "mongoose"

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    isbn: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
    },
    description: {
      type: String,
      trim: true,
    },
    cover: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["to-read", "reading", "completed"],
      default: "to-read",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const Book = mongoose.model("Book", bookSchema)

export default Book
