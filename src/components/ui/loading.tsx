import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

export const LoadingSpinner = ({
  size = 'md',
  text,
  className,
}: LoadingSpinnerProps) => (
  <div
    className={cn('flex items-center justify-center min-h-[200px]', className)}
  >
    <div className="text-center">
      <Loader2
        className={cn(
          'animate-spin text-blue-600 mx-auto mb-4',
          sizeClasses[size],
        )}
      />
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  </div>
)

type LoadingCardProps = {
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingCard = ({
  title,
  description,
  size = 'md',
  className,
}: LoadingCardProps) => (
  <div
    className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}
  >
    <div className="text-center">
      <Loader2
        className={cn(
          'animate-spin text-blue-600 mx-auto mb-4',
          sizeClasses[size],
        )}
      />
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      )}
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  </div>
)

type LoadingButtonProps = {
  loading?: boolean
  children: React.ReactNode
  className?: string
}

export const LoadingButton = ({
  loading,
  children,
  className,
}: LoadingButtonProps) => (
  <div className={cn('flex items-center gap-2', className)}>
    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
    {children}
  </div>
)

type LoadingGridProps = {
  count?: number
  className?: string
}

export const LoadingGrid = ({ count = 6, className }: LoadingGridProps) => (
  <div
    className={cn(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
      className,
    )}
  >
    {Array.from({ length: count }).map((_, index) => (
      <LoadingCard key={index} size="sm" />
    ))}
  </div>
)
