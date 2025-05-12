"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookDashboard } from "@/components/book-dashboard"
import { useRouter } from "next/navigation"
import { Library, LogOut, Search, Plus } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { getUserBooks } from "@/lib/api/books"
import type { Book } from "@/lib/types"

export default function Dashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    async function fetchData() {
      try {
        const data = await getUserBooks()
        if (data.success && data.data) {
          setBooks(data.data || [])
          setFilteredBooks(data.data || [])
        } else {
          console.error("Failed to fetch books:", data.message)
        }
      } catch (error) {
        console.error("Failed to fetch books:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, user])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBooks(books)
    } else {
      const filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredBooks(filtered)
    }
  }, [searchTerm, books])

  async function handleLogout() {
    logout()
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your books...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Library className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold text-slate-800">BookShelf</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 hidden md:inline-block">Welcome, {user?.name || "Reader"}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Book Collection</h1>
            <p className="text-slate-600">Manage and organize your personal library</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search books..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link href="/books/add">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Book
              </Button>
            </Link>
          </div>
        </div>

        {books.length === 0 ? (
          <Card className="border-dashed border-2 bg-slate-50">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Library className="h-8 w-8 text-slate-400" />
              </div>
              <CardTitle className="text-xl mb-2">Your library is empty</CardTitle>
              <CardDescription className="mb-4">
                Start building your collection by adding your first book.
              </CardDescription>
              <Link href="/books/add">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Book
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <BookDashboard books={filteredBooks} />
        )}
      </main>
    </div>
  )
}
