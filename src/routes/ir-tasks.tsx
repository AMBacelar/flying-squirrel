import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle, Brain } from 'lucide-react'
import { z } from 'zod'
import { fallback, zodValidator } from '@tanstack/zod-adapter'
import type { IRTask } from '@/types/api'
import { useIRTasks } from '@/hooks/useApi'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading IR tasks...</p>
          </div>
        </div>
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
          <IRTaskCard key={task.uuid} task={task} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center py-8">
          <button
            onClick={() => loadMore()}
            disabled={isLoadingMore}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoadingMore ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading...
              </>
            ) : (
              `Load More Tasks`
            )}
          </button>
        </div>
      )}

      {/* End Message */}
      {!hasMore && irTasks.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          You've reached the end! All {total} tasks loaded.
        </div>
      )}

      {/* Empty State */}
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

type IRTaskCardProps = {
  task: IRTask
}

const IRTaskCard = ({ task }: IRTaskCardProps) => {
  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{task.name}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          UUID: {task.uuid.slice(0, 8)}...
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Task Details */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Created:</span>
            <span>{new Date(task.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Updated:</span>
            <span>{new Date(task.updated_at).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Realogram:</span>
            <span
              className={
                task.compute_realogram ? 'text-green-600' : 'text-gray-400'
              }
            >
              {task.compute_realogram ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shares:</span>
            <span
              className={
                task.compute_shares ? 'text-green-600' : 'text-gray-400'
              }
            >
              {task.compute_shares ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Select Task
        </button>
      </CardContent>
    </Card>
  )
}
