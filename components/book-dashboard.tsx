"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Book, BookOpen, Edit, MoreHorizontal } from "lucide-react"
import type { Book as BookType } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BookDashboardProps {
  books: BookType[]
}

export function BookDashboard({ books }: BookDashboardProps) {
  const [activeTab, setActiveTab] = useState("all")

  const filteredBooks = books.filter((book) => {
    if (activeTab === "all") return true
    return book.status === activeTab
  })

  function getStatusBadge(status: string) {
    switch (status) {
      case "reading":
        return <Badge className="bg-amber-500">Reading</Badge>
      case "completed":
        return <Badge className="bg-emerald-600">Completed</Badge>
      default:
        return <Badge className="bg-slate-500">To Read</Badge>
    }
  }

  return (
    <div>
      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Books ({books.length})</TabsTrigger>
          <TabsTrigger value="to-read">To Read ({books.filter((b) => b.status === "to-read").length})</TabsTrigger>
          <TabsTrigger value="reading">Reading ({books.filter((b) => b.status === "reading").length})</TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({books.filter((b) => b.status === "completed").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="to-read" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reading" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed">
          <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">No books found</h3>
          <p className="text-slate-500 mb-4">
            {activeTab === "all"
              ? "Your collection is empty. Add your first book to get started."
              : `You don't have any books in the "${activeTab}" category.`}
          </p>
        </div>
      )}
    </div>
  )
}

function BookCard({ book }: { book: BookType }) {
  function getStatusBadge(status: string) {
    switch (status) {
      case "reading":
        return <Badge className="bg-amber-500">Reading</Badge>
      case "completed":
        return <Badge className="bg-emerald-600">Completed</Badge>
      default:
        return <Badge className="bg-slate-500">To Read</Badge>
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/books/${book._id}`} className="block h-full">
        <div className="flex h-full">
          <div className="w-1/3 bg-slate-100 flex items-center justify-center p-4">
            {book.cover ? (
              <img
                src={book.cover || "/placeholder.svg"}
                alt={`Cover of ${book.title}`}
                className="w-full h-40 object-cover rounded-md"
              />
            ) : (
              <Book className="h-12 w-12 text-slate-400" />
            )}
          </div>
          <CardContent className="w-2/3 p-4 flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-800 line-clamp-2">{book.title}</h3>
                <p className="text-sm text-slate-600">{book.author}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href={`/books/${book._id}`}>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                  </Link>
                  <Link href={`/books/${book._id}/edit`}>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-auto pt-2">{book.status && getStatusBadge(book.status)}</div>
          </CardContent>
        </div>
      </Link>
    </Card>
  )
}
