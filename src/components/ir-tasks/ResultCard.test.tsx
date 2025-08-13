import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResultCard } from './ResultCard'
import type { ImageResult } from '@/types/api'

const createMockResult = (
  overrides: Partial<ImageResult> = {},
): ImageResult => ({
  uuid: '123e4567-e89b-12d3-a456-426614174000',
  task_uuid: '123e4567-e89b-12d3-a456-426614174001',
  image_url: 'https://example.com/image.jpg',
  status: 'IN_PROGRESS',
  failure_reason: null,
  duration: null,
  created_at: '2025-01-13T12:00:00Z',
  updated_at: '2025-01-13T12:00:00Z',
  postprocessing_results: {
    realogram: null,
    shares: [],
  },
  coco: {},
  confidence_score: null,
  ...overrides,
})

const mockCompletedResult = createMockResult({
  status: 'COMPLETED',
  duration: 2500,
  confidence_score: 0.95,
  postprocessing_results: {
    realogram: {
      gaps: [
        { shelf_id: 1, slot: 2, stack_index: 0, bbox: [0, 0, 100, 100] },
        { shelf_id: 1, slot: 3, stack_index: 0, bbox: [100, 0, 200, 100] },
      ],
      item_entries: [
        { annotation_id: 1, shelf_id: 1, slot: 1, stack_index: 0 },
        { annotation_id: 2, shelf_id: 1, slot: 4, stack_index: 0 },
      ],
    },
    shares: [
      {
        image_id: 1,
        values: [
          {
            group_by: 'products',
            product_uuid: 'prod-1',
            count: 5,
            count_ratio: 0.5,
            area: 1000,
            area_ratio: 0.6,
          },
          {
            group_by: 'tags',
            product_uuid: null,
            tag_uuid: 'tag-1',
            count: 3,
            count_ratio: 0.3,
            area: 500,
            area_ratio: 0.3,
          },
        ],
      },
    ],
  },
})

const mockFailedResult = createMockResult({
  status: 'FAILED',
  failure_reason: 'Image processing failed due to invalid format',
  duration: null,
  confidence_score: 0.0,
  postprocessing_results: {
    realogram: null,
    shares: [],
  },
})

describe('ResultCard', () => {
  it('renders basic result information', () => {
    const result = createMockResult()
    render(<ResultCard result={result} />)

    expect(screen.getByText('Processing')).toBeInTheDocument()
    expect(screen.getByText('123e4567...')).toBeInTheDocument() // UUID
    expect(screen.getAllByText('N/A')).toHaveLength(2) // Duration and Confidence
  })

  it('displays correct status for IN_PROGRESS', () => {
    const result = createMockResult({ status: 'IN_PROGRESS' })
    render(<ResultCard result={result} />)

    expect(screen.getByText('Processing')).toBeInTheDocument()
    expect(screen.getAllByText('N/A')).toHaveLength(2) // Duration and Confidence
  })

  it('displays correct status for COMPLETED', () => {
    render(<ResultCard result={mockCompletedResult} />)

    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('2.5s')).toBeInTheDocument() // Duration
    expect(screen.getByText('95.0%')).toBeInTheDocument() // Confidence
  })

  it('displays correct status for FAILED', () => {
    render(<ResultCard result={mockFailedResult} />)

    expect(screen.getByText('Failed')).toBeInTheDocument()
    expect(screen.getAllByText('N/A')).toHaveLength(2) // Duration and Confidence
  })

  it('displays failure reason when status is FAILED', () => {
    render(<ResultCard result={mockFailedResult} />)

    expect(screen.getByText('Processing Error')).toBeInTheDocument()
    expect(
      screen.getByText('Image processing failed due to invalid format'),
    ).toBeInTheDocument()
  })

  it('shows detection results section for completed results', () => {
    render(<ResultCard result={mockCompletedResult} />)

    expect(screen.getByText('Detection Results')).toBeInTheDocument()
    expect(screen.getAllByText('2')).toHaveLength(3) // Gaps, Items, and Shares counts
  })

  it('does not show detection results for non-completed results', () => {
    const result = createMockResult({ status: 'IN_PROGRESS' })
    render(<ResultCard result={result} />)

    expect(screen.queryByText('Detection Results')).not.toBeInTheDocument()
  })

  it('shows view processed image button for completed results', () => {
    render(<ResultCard result={mockCompletedResult} />)

    expect(
      screen.getByRole('button', { name: /view processed image/i }),
    ).toBeInTheDocument()
  })

  it('does not show view processed image button for non-completed results', () => {
    const result = createMockResult({ status: 'IN_PROGRESS' })
    render(<ResultCard result={result} />)

    expect(
      screen.queryByRole('button', { name: /view processed image/i }),
    ).not.toBeInTheDocument()
  })

  it('formats duration correctly', () => {
    const resultWithDuration = createMockResult({
      status: 'COMPLETED',
      duration: 1500,
    })
    render(<ResultCard result={resultWithDuration} />)

    expect(screen.getByText('1.5s')).toBeInTheDocument()
  })

  it('handles zero duration', () => {
    const resultWithZeroDuration = createMockResult({
      status: 'COMPLETED',
      duration: 0,
    })
    render(<ResultCard result={resultWithZeroDuration} />)

    expect(screen.getAllByText('N/A')).toHaveLength(2) // Duration and Confidence both show N/A
  })

  it('handles null postprocessing results gracefully', () => {
    const resultWithNullPostprocessing = createMockResult({
      status: 'COMPLETED',
      postprocessing_results: null,
    })
    render(<ResultCard result={resultWithNullPostprocessing} />)

    expect(screen.queryByText('Detection Results')).not.toBeInTheDocument()
  })

  it('handles null realogram gracefully', () => {
    const resultWithNullRealogram = createMockResult({
      status: 'COMPLETED',
      postprocessing_results: {
        realogram: null,
        shares: [],
      },
    })
    render(<ResultCard result={resultWithNullRealogram} />)

    expect(screen.queryByText('Detection Results')).not.toBeInTheDocument()
  })
})
