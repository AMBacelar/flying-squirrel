import type { IRTask } from '@/types/api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type IRTaskCardProps = {
  task: IRTask
  onSelect: (task: IRTask) => void
}

export const IRTaskCard = ({ task, onSelect }: IRTaskCardProps) => {
  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{task.name}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          UUID: {task.uuid.slice(0, 8)}...
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
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

        <Button className="w-full mt-4" onClick={() => onSelect(task)}>
          Select Task
        </Button>
      </CardContent>
    </Card>
  )
}
