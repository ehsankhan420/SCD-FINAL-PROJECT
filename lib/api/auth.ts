import type { ApiResponse, User } from "@/lib/types"
import { storage } from "@/lib/utils"

// Use environment variable or fallback to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface RegisterData {
  name: string
  email: string
  password: string
}

interface LoginData {
  email: string
  password: string
}

interface LoginResponse {
  success: boolean
  message?: string
  token?: string
}

export async function registerUser(data: RegisterData): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
        message: result.message || "Registration failed",
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("Register error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function loginUser(data: LoginData): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
        message: result.message || "Login failed",
      }
    }

    return {
      success: true,
      token: result.token,
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  try {
    const token = storage.getItem("token")

    if (!token) {
      return {
        success: false,
        message: "No authentication token found",
      }
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
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
        message: result.message || "Failed to get user",
      }
    }

    return {
      success: true,
      data: result.user,
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
