"use server"

import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"
import type { Book, User } from "./types"

// Simulated database
const users: User[] = []
const books: Book[] = []
const sessions: Record<string, { userId: string; expires: Date }> = {}

// Helper function to check if user is authenticated
function getAuthenticatedUser() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get("session_id")?.value

  if (!sessionId || !sessions[sessionId]) {
    return null
  }

  const session = sessions[sessionId]

  if (new Date() > session.expires) {
    delete sessions[sessionId]
    return null
  }

  const user = users.find((u) => u.id === session.userId)
  return user || null
}

// Register a new user
export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  // Validation
  if (!name || !email || !password) {
    return { success: false, error: "All fields are required" }
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" }
  }

  // Check if user already exists
  if (users.some((user) => user.email === email)) {
    return { success: false, error: "Email already in use" }
  }

  // Create new user (in a real app, you would hash the password)
  const newUser: User = {
    id: uuidv4(),
    name,
    email,
  }

  // Store user in our simulated database
  users.push({ ...newUser, ...{ password } } as any)

  return { success: true }
}

// Login user
export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Find user
  const user = users.find((u) => u.email === email && (u as any).password === password)

  if (!user) {
    return { success: false, error: "Invalid email or password" }
  }

  // Create session
  const sessionId = uuidv4()
  const expires = new Date()
  expires.setDate(expires.getDate() + 7) // Session expires in 7 days

  sessions[sessionId] = {
    userId: user.id,
    expires,
  }

  // Set session cookie
  cookies().set("session_id", sessionId, {
    expires,
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })

  return { success: true }
}

// Logout user
export async function logoutUser() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get("session_id")?.value

  if (sessionId) {
    delete sessions[sessionId]
    cookies().delete("session_id")
  }

  return { success: true }
}

// Get user's books
export async function getUserBooks() {
  const user = getAuthenticatedUser()

  if (!user) {
    return { redirect: true }
  }

  const userBooks = books.filter((book) => book.userId === user.id)

  return {
    books: userBooks,
    user: { name: user.name },
  }
}

// Add a new book
export async function addBook(formData: FormData) {
  const user = getAuthenticatedUser()

  if (!user) {
    return { redirect: true }
  }

  const title = formData.get("title") as string
  const author = formData.get("author") as string
  const isbn = formData.get("isbn") as string
  const yearStr = formData.get("year") as string
  const year = yearStr ? Number.parseInt(yearStr) : undefined
  const description = formData.get("description") as string
  const cover = formData.get("cover") as string
  const status = formData.get("status") as string

  if (!title || !author) {
    return { success: false, error: "Title and author are required" }
  }

  const newBook: Book = {
    id: uuidv4(),
    title,
    author,
    isbn: isbn || undefined,
    year: year || undefined,
    description: description || undefined,
    cover: cover || undefined,
    status: status || "to-read",
    userId: user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  books.push(newBook)

  return { success: true }
}

// Get a single book
export async function getBook(id: string) {
  const user = getAuthenticatedUser()

  if (!user) {
    return { redirect: true }
  }

  const book = books.find((b) => b.id === id && b.userId === user.id)

  if (!book) {
    return { success: false, error: "Book not found" }
  }

  return { success: true, book }
}

// Update a book
export async function updateBook(formData: FormData) {
  const user = getAuthenticatedUser()

  if (!user) {
    return { redirect: true }
  }

  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const author = formData.get("author") as string
  const isbn = formData.get("isbn") as string
  const yearStr = formData.get("year") as string
  const year = yearStr ? Number.parseInt(yearStr) : undefined
  const description = formData.get("description") as string
  const cover = formData.get("cover") as string
  const status = formData.get("status") as string

  if (!title || !author) {
    return { success: false, error: "Title and author are required" }
  }

  const bookIndex = books.findIndex((b) => b.id === id && b.userId === user.id)

  if (bookIndex === -1) {
    return { success: false, error: "Book not found" }
  }

  books[bookIndex] = {
    ...books[bookIndex],
    title,
    author,
    isbn: isbn || undefined,
    year: year || undefined,
    description: description || undefined,
    cover: cover || undefined,
    status: status || "to-read",
    updatedAt: new Date().toISOString(),
  }

  return { success: true }
}

// Delete a book
export async function deleteBook(id: string) {
  const user = getAuthenticatedUser()

  if (!user) {
    return { redirect: true }
  }

  const bookIndex = books.findIndex((b) => b.id === id && b.userId === user.id)

  if (bookIndex === -1) {
    return { success: false, error: "Book not found" }
  }

  books.splice(bookIndex, 1)

  return { success: true }
}
