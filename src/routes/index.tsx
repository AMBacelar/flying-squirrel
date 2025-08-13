import { Link, createFileRoute } from '@tanstack/react-router'
import { Package } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center py-12 mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Neurolabs Catalog Viewer
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Browse and visualize catalog items with status highlighting
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/catalog">
              <Package className="h-5 w-5 mr-2" />
              View Catalog
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
