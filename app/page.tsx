import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Library, User } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Library className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold text-slate-800">BookShelf</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
                Manage Your Personal Library <span className="text-emerald-600">Effortlessly</span>
              </h1>
              <p className="text-lg text-slate-600">
                Keep track of your books, organize your collection, and discover new reads with our intuitive book
                management system.
              </p>
              <div className="flex gap-4 pt-4">
                <Link href="/register">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-6">Get Started</Button>
                </Link>
                <Link href="/books">
                  <Button variant="outline" className="px-6 py-6">
                    Browse Books
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-6 -left-6 w-full h-full bg-emerald-200 rounded-lg transform rotate-3"></div>
                <div className="absolute -bottom-6 -right-6 w-full h-full bg-emerald-300 rounded-lg transform -rotate-3"></div>
                <div className="relative bg-white p-8 rounded-lg shadow-lg">
                  <div className="flex justify-center mb-6">
                    <BookOpen className="h-16 w-16 text-emerald-600" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-8 bg-slate-100 rounded-md"></div>
                    <div className="h-8 bg-slate-100 rounded-md"></div>
                    <div className="h-8 bg-slate-100 rounded-md w-3/4"></div>
                    <div className="h-20 bg-slate-100 rounded-md"></div>
                    <div className="h-8 bg-emerald-100 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800">Book Management</h3>
                <p className="text-slate-600">Add, edit, and organize your book collection with ease.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <User className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800">User Accounts</h3>
                <p className="text-slate-600">
                  Create your personal account to keep your library synced across devices.
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Library className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800">Reading Stats</h3>
                <p className="text-slate-600">
                  Track your reading progress and get insights about your reading habits.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Library className="h-6 w-6 text-emerald-400" />
              <span className="text-xl font-bold">BookShelf</span>
            </div>
            <div className="text-slate-400 text-sm">© {new Date().getFullYear()} BookShelf. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
