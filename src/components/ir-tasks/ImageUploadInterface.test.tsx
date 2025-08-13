import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ImageUploadInterface } from './ImageUploadInterface'
import type { IRTask } from '@/types/api'

vi.mock('@/hooks/useApi', () => ({
  useSubmitImages: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    error: null,
  }),
}))

vi.mock('react-dropzone', () => ({
  useDropzone: () => ({
    getRootProps: () => ({ onClick: vi.fn() }),
    getInputProps: () => ({}),
    isDragActive: false,
    isDragReject: false,
    fileRejections: [],
  }),
}))

vi.mock('./TaskResultsSection', () => ({
  TaskResultsSection: ({ taskUuid }: { taskUuid: string }) => (
    <div data-testid="task-results-section" data-task-uuid={taskUuid}>
      Task Results Section
    </div>
  ),
}))

const mockTask: IRTask = {
  uuid: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Test Image Recognition Task',
  created_at: '2025-01-13T12:00:00Z',
  updated_at: '2025-01-13T12:00:00Z',
  compute_realogram: true,
  compute_shares: false,
}

describe('ImageUploadInterface', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders task details correctly', () => {
    render(<ImageUploadInterface task={mockTask} />)

    expect(screen.getByText('Task Details')).toBeInTheDocument()
    expect(
      screen.getByText('123e4567-e89b-12d3-a456-426614174000'),
    ).toBeInTheDocument()
    expect(screen.getByText('Enabled')).toBeInTheDocument() // Realogram
    expect(screen.getByText('Disabled')).toBeInTheDocument() // Shares
  })

  it('renders upload section with correct title', () => {
    render(<ImageUploadInterface task={mockTask} />)

    expect(screen.getByText('Upload Images')).toBeInTheDocument()
  })

  it('renders task results section', () => {
    render(<ImageUploadInterface task={mockTask} />)

    expect(screen.getByTestId('task-results-section')).toBeInTheDocument()
    expect(screen.getByTestId('task-results-section')).toHaveAttribute(
      'data-task-uuid',
      mockTask.uuid,
    )
  })

  it('displays correct task configuration', () => {
    const taskWithShares = {
      ...mockTask,
      compute_realogram: false,
      compute_shares: true,
    }

    render(<ImageUploadInterface task={taskWithShares} />)

    expect(screen.getByText('Disabled')).toBeInTheDocument() // Realogram
    expect(screen.getByText('Enabled')).toBeInTheDocument() // Shares
  })

  it('shows upload instructions', () => {
    render(<ImageUploadInterface task={mockTask} />)

    expect(
      screen.getByText(/Drop images here or click to select/),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Supports JPG, PNG, WebP, GIF, BMP \(max 10MB each\)/),
    ).toBeInTheDocument()
  })

  it('handles task with different UUID format', () => {
    const taskWithShortUuid = {
      ...mockTask,
      uuid: 'short-uuid',
    }

    render(<ImageUploadInterface task={taskWithShortUuid} />)

    expect(screen.getByText('short-uuid')).toBeInTheDocument()
  })

  it('displays task UUID in task details', () => {
    render(<ImageUploadInterface task={mockTask} />)

    expect(
      screen.getByText('123e4567-e89b-12d3-a456-426614174000'),
    ).toBeInTheDocument()
  })

  it('renders with minimal task data', () => {
    const minimalTask: IRTask = {
      uuid: 'minimal-uuid',
      name: 'Minimal Task',
      created_at: '2025-01-13T12:00:00Z',
      updated_at: '2025-01-13T12:00:00Z',
      compute_realogram: false,
      compute_shares: false,
    }

    render(<ImageUploadInterface task={minimalTask} />)

    expect(screen.getByText('minimal-uuid')).toBeInTheDocument()
    expect(screen.getAllByText('Disabled')).toHaveLength(2) // Both features disabled
  })

  it('handles task with special characters in UUID', () => {
    const taskWithSpecialChars = {
      ...mockTask,
      uuid: 'task-with-special-chars-123',
    }

    render(<ImageUploadInterface task={taskWithSpecialChars} />)

    expect(screen.getByText('task-with-special-chars-123')).toBeInTheDocument()
  })
})
