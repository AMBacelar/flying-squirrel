import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Brain, Eye, Package, Upload } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center py-12 mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Neurolabs Frontend Test
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Image Recognition API integration with catalog visualization and image
          submission
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" asChild size="lg">
            <Link to="/catalog">
              <Package className="h-5 w-5 mr-2" />
              View Catalog
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/ir-tasks">
              <Brain className="h-5 w-5 mr-2" />
              IR Tasks
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="transition-all duration-200 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-6 w-6 text-blue-600" />
              Task 1: Catalog Visualization
            </CardTitle>
            <CardDescription>
              Browse and visualize catalog items with status highlighting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Display catalog items with thumbnails
              </li>
              <li className="flex items-center gap-2">
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                Highlight items with "INCOMPLETE" status
              </li>
              <li className="flex items-center gap-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                Show item details and metadata
              </li>
            </ul>
            <Button asChild className="w-full">
              <Link to="/catalog">
                View Catalog
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              Task 2: Image Recognition
            </CardTitle>
            <CardDescription>
              Submit images to IR tasks and track processing status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload images to IR tasks
              </li>
              <li className="flex items-center gap-2">
                <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse"></div>
                Real-time status tracking
              </li>
              <li className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                View detection results
              </li>
            </ul>
            <Button asChild className="w-full">
              <Link to="/ir-tasks">
                View IR Tasks
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
