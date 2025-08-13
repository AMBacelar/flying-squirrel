import { ResultCard } from './ResultCard'
import { useTaskResults } from '@/hooks/useApi'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoadingCard } from '@/components/ui/loading'

type TaskResultsSectionProps = {
  taskUuid: string
}

export const TaskResultsSection = ({ taskUuid }: TaskResultsSectionProps) => {
  const { data: taskResults, isLoading, error } = useTaskResults(taskUuid)

  if (isLoading) {
    return (
      <LoadingCard
        title="Processing History"
        description="Loading existing results..."
        size="md"
      />
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Processing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            Error loading results: {error.message}
          </div>
        </CardContent>
      </Card>
    )
  }

  const results = taskResults?.items || []
  const inProgressCount = results.filter(
    (r) => r.status === 'IN_PROGRESS',
  ).length
  const completedCount = results.filter((r) => r.status === 'COMPLETED').length
  const failedCount = results.filter((r) => r.status === 'FAILED').length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing History ({results.length})</CardTitle>
        <CardDescription>
          {inProgressCount > 0 && (
            <span className="text-blue-600">{inProgressCount} processing</span>
          )}
          {inProgressCount > 0 &&
            (completedCount > 0 || failedCount > 0) &&
            ' • '}
          {completedCount > 0 && (
            <span className="text-green-600">{completedCount} completed</span>
          )}
          {completedCount > 0 && failedCount > 0 && ' • '}
          {failedCount > 0 && (
            <span className="text-red-600">{failedCount} failed</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No images have been processed for this task yet.
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <ResultCard key={result.uuid} result={result} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
