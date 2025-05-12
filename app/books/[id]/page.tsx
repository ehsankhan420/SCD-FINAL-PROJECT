"use client"

import { useState, useEffect } from "react"
import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Library, ArrowLeft, Edit, Trash2, BookOpen } from "lucide-react"
import { getBook, deleteBook } from "@/lib/api/books"
import type { Book } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/hooks/use-auth"

export default function BookDetails({ params }: { params: { id: string } }) {
  // Unwrap params with React.use() to handle the Promise
  const id = params?.id
  
  const router = useRouter()
  const { user } = useAuth()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    async function fetchBook() {
      try {
        const result = await getBook(id)
        if (result.success && result.data) {
          setBook(result.data)
        } else {
          setError("Book not found")
        }
      } catch (err) {
        setError("Failed to load book details")
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [id, router, user])

  async function handleDelete() {
    setDeleteLoading(true)
    try {
      const result = await deleteBook(id)
      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.message || "Failed to delete book")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setDeleteLoading(false)
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "reading":
        return <Badge className="bg-amber-500">Currently Reading</Badge>
      case "completed":
        return <Badge className="bg-emerald-600">Completed</Badge>
      default:
        return <Badge className="bg-slate-500">To Read</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading book details...</p>
        </div>
      </div>
    )
  }

  if (!book && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Book Not Found</h2>
            <p className="mb-4">The book you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link href="/dashboard">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
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
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/dashboard" className="flex items-center text-emerald-600 hover:text-emerald-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 p-6 flex justify-center">
              <div className="w-48 h-64 bg-slate-100 rounded-md overflow-hidden shadow-md flex items-center justify-center">
                {book?.cover ? (
                  <img
                    src={book.cover || "/placeholder.svg"}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookOpen className="h-16 w-16 text-slate-400" />
                )}
              </div>
            </div>
            <div className="md:w-2/3 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">{book?.title}</h1>
                  <p className="text-xl text-slate-600 mb-4">by {book?.author}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/books/${id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{book?.title}" from your collection. This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-red-500 hover:bg-red-600"
                          disabled={deleteLoading}
                        >
                          {deleteLoading ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {book?.status && getStatusBadge(book.status)}
                  {book?.isbn && (
                    <Badge variant="outline" className="text-slate-600">
                      ISBN: {book.isbn}
                    </Badge>
                  )}
                  {book?.year && (
                    <Badge variant="outline" className="text-slate-600">
                      Published: {book.year}
                    </Badge>
                  )}
                </div>

                <div className="pt-4">
                  <h2 className="text-lg font-semibold mb-2">Description</h2>
                  <p className="text-slate-600">{book?.description || "No description available."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
