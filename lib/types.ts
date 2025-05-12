export interface Book {
  _id: string
  title: string
  author: string
  isbn?: string
  year?: number
  description?: string
  cover?: string
  status?: string
  user: string
  createdAt: string
  updatedAt: string
}

export interface User {
  _id: string
  name: string
  email: string
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}
