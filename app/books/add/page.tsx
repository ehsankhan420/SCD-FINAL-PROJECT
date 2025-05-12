"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Library, AlertCircle, ArrowLeft } from "lucide-react"
import { addBook } from "@/lib/api/books"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/hooks/use-auth"

export default function AddBook() {
  const router = useRouter()
  const { user } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("to-read")

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const bookData = {
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      isbn: formData.get("isbn") as string,
      year: formData.get("year") ? Number(formData.get("year")) : undefined,
      description: formData.get("description") as string,
      cover: formData.get("cover") as string,
      status: status,
    }

    try {
      const result = await addBook(bookData)

      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.message || "Failed to add book. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
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

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/dashboard" className="flex items-center text-emerald-600 hover:text-emerald-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add New Book</CardTitle>
            <CardDescription>Enter the details of the book you want to add to your collection</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Book Title</Label>
                <Input id="title" name="title" placeholder="The Great Gatsby" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" name="author" placeholder="F. Scott Fitzgerald" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN (optional)</Label>
                  <Input id="isbn" name="isbn" placeholder="9780743273565" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Publication Year (optional)</Label>
                  <Input id="year" name="year" type="number" placeholder="1925" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Reading Status</Label>
                <Select defaultValue="to-read" onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="to-read">To Read</SelectItem>
                    <SelectItem value="reading">Currently Reading</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover">Cover Image URL (optional)</Label>
                <Input id="cover" name="cover" placeholder="https://example.com/book-cover.jpg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="A brief description of the book..."
                  rows={4}
                />
              </div>
              <div className="pt-2">
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                  {loading ? "Adding Book..." : "Add Book"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
