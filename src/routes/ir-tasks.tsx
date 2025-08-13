import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle, ArrowLeft, Brain, Upload } from 'lucide-react'
import { z } from 'zod'
import { fallback, zodValidator } from '@tanstack/zod-adapter'
import { useState } from 'react'
import type { IRTask } from '@/types/api'
import { useIRTasks } from '@/hooks/useApi'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading'
import { IRTaskCard, ImageUploadInterface } from '@/components/ir-tasks'

const ValidSearchParams = z.object({
  limit: fallback(
    z.coerce.number().pipe(z.number().min(1).max(100)),
    50,
  ).optional(),
})

export const Route = createFileRoute('/ir-tasks')({
  validateSearch: zodValidator(ValidSearchParams),
  component: IRTasksPage,
})

function IRTasksPage() {
  const { limit } = Route.useSearch()
  const [selectedTask, setSelectedTask] = useState<IRTask | null>(null)
  const {
    items: irTasks,
    total,
    hasMore,
    loadMore,
    isLoadingMore,
    isLoading,
    error,
    refetch,
  } = useIRTasks(limit)

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <LoadingSpinner size="lg" text="Loading IR tasks..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading IR tasks: {error.message}
            <button
              onClick={() => refetch()}
              className="ml-2 underline hover:no-underline"
            >
              Try again
            </button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (selectedTask) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Button
          variant="outline"
          onClick={() => setSelectedTask(null)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Upload className="h-8 w-8" />
            Upload Images
          </h1>
          <p className="text-gray-600 mt-1">
            Selected Task: {selectedTask.name}
          </p>
        </div>

        <ImageUploadInterface task={selectedTask} />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-8 w-8" />
            Image Recognition Tasks
          </h1>
          <p className="text-gray-600 mt-1">
            Showing {irTasks.length} of {total} tasks
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {irTasks.map((task) => (
          <IRTaskCard key={task.uuid} task={task} onSelect={setSelectedTask} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center py-8">
          <Button
            onClick={() => loadMore()}
            isLoading={isLoadingMore}
            loadingText="Loading..."
            className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700"
          >
            Load More Tasks
          </Button>
        </div>
      )}

      {!hasMore && irTasks.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          You've reached the end! All {total} tasks loaded.
        </div>
      )}

      {irTasks.length === 0 && (
        <div className="text-center py-12">
          <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No IR tasks found
          </h3>
          <p className="text-gray-600">
            No image recognition tasks are available. Check your API
            configuration.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh Tasks
          </button>
        </div>
      )}
    </div>
  )
}
