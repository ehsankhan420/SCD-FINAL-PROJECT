import type { ApiResponse, Book } from "@/lib/types"
import { storage } from "@/lib/utils"

// Use environment variable or fallback to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper function to get the auth token
function getAuthHeader() {
  const token = storage.getItem("token")
  return {
    Authorization: `Bearer ${token}`,
  }
}

export async function getUserBooks(): Promise<ApiResponse<Book[]>> {
  try {
    const response = await fetch(`${API_URL}/books`, {
      headers: {
        ...getAuthHeader(),
      },
    })

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return {
        success: false,
        message: "Server returned non-JSON response",
      };
    }

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to fetch books",
      }
    }

    return {
      success: true,
      data: result.books,
    }
  } catch (error) {
    console.error("Get books error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function getBook(id: string): Promise<ApiResponse<Book>> {
  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      headers: {
        ...getAuthHeader(),
      },
    })

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return {
        success: false,
        message: "Server returned non-JSON response",
      };
    }

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to fetch book",
      }
    }

    return {
      success: true,
      data: result.book,
    }
  } catch (error) {
    console.error("Get book error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

interface BookData {
  title: string
  author: string
  isbn?: string
  year?: number
  description?: string
  cover?: string
  status?: string
}

export async function addBook(bookData: BookData): Promise<ApiResponse<Book>> {
  try {
    const response = await fetch(`${API_URL}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(bookData),
    })

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return {
        success: false,
        message: "Server returned non-JSON response",
      };
    }

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to add book",
      }
    }

    return {
      success: true,
      data: result.book,
    }
  } catch (error) {
    console.error("Add book error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function updateBook(id: string, bookData: BookData): Promise<ApiResponse<Book>> {
  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(bookData),
    })

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return {
        success: false,
        message: "Server returned non-JSON response",
      };
    }

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to update book",
      }
    }

    return {
      success: true,
      data: result.book,
    }
  } catch (error) {
    console.error("Update book error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function deleteBook(id: string): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeader(),
      },
    })

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return {
        success: false,
        message: "Server returned non-JSON response",
      };
    }

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to delete book",
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("Delete book error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
