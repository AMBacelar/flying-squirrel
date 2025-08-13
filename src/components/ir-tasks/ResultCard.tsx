import {
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Package,
  Target,
  Timer,
  Trophy,
  XCircle,
} from 'lucide-react'
import type { ImageResult } from '@/types/api'
import { Button } from '@/components/ui/button'

type ResultCardProps = {
  result: ImageResult
}

export const ResultCard = ({ result }: ResultCardProps) => {
  const formatDuration = (duration: number | null) => {
    if (duration === null || duration <= 0) return 'N/A'
    return `${(duration / 1000).toFixed(1)}s`
  }

  const getStatusDisplay = () => {
    switch (result.status) {
      case 'IN_PROGRESS':
        return {
          icon: <Clock className="h-4 w-4 text-blue-500 animate-pulse" />,
          label: 'Processing',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
        }
      case 'COMPLETED':
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          label: 'Completed',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        }
      case 'FAILED':
        return {
          icon: <XCircle className="h-4 w-4 text-red-500" />,
          label: 'Failed',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        }
      default:
        return {
          icon: <Clock className="h-4 w-4 text-gray-500" />,
          label: 'Unknown',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        }
    }
  }

  const statusDisplay = getStatusDisplay()

  return (
    <div
      className={`border rounded-lg p-4 hover:shadow-md transition-all duration-200 ${statusDisplay.borderColor} ${statusDisplay.bgColor}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusDisplay.borderColor} bg-white`}
        >
          {statusDisplay.icon}
          <span className={`font-medium text-sm ${statusDisplay.color}`}>
            {statusDisplay.label}
          </span>
        </div>
        <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
          {result.uuid.slice(0, 8)}...
        </span>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Timer className="h-3.5 w-3.5" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Duration
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {formatDuration(result.duration)}
            </span>
          </div>

          <div className="bg-white rounded-lg p-3 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Trophy className="h-3.5 w-3.5" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Confidence
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {result.status === 'COMPLETED' && result.confidence_score !== null
                ? `${(result.confidence_score * 100).toFixed(1)}%`
                : 'N/A'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Created
            </span>
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {new Date(result.created_at).toLocaleString()}
          </span>
        </div>

        {result.failure_reason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-700 text-sm font-medium">
                Processing Error
              </span>
            </div>
            <p className="text-red-600 text-sm leading-relaxed">
              {result.failure_reason}
            </p>
          </div>
        )}

        {result.image_url && result.status === 'COMPLETED' && (
          <Button
            variant="default"
            size="sm"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            onClick={() => window.open(result.image_url, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Processed Image
          </Button>
        )}

        {result.status === 'COMPLETED' &&
          result.postprocessing_results?.realogram && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-green-600" />
                <h4 className="text-sm font-semibold text-gray-900">
                  Detection Results
                </h4>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full mx-auto mb-1">
                    <Target className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {result.postprocessing_results.realogram.gaps.length || 0}
                  </div>
                  <div className="text-xs text-gray-600">Gaps</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-1">
                    <Package className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {result.postprocessing_results.realogram.item_entries
                      .length || 0}
                  </div>
                  <div className="text-xs text-gray-600">Items</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mx-auto mb-1">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {result.postprocessing_results.shares.reduce(
                      (acc, share) => acc + share.values.length,
                      0,
                    )}
                  </div>
                  <div className="text-xs text-gray-600">Shares</div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}
