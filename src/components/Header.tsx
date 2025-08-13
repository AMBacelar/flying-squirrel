import { Link } from '@tanstack/react-router'
import { Brain, Home, Package } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <h1 className="text-xl font-bold text-gray-900">Neurolabs Test</h1>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/catalog"
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Package className="h-4 w-4" />
              <span>Catalog</span>
            </Link>

            <Link
              to="/ir-tasks"
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Brain className="h-4 w-4" />
              <span>IR Tasks</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
