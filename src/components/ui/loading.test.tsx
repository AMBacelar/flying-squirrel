import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  LoadingButton,
  LoadingCard,
  LoadingGrid,
  LoadingSpinner,
} from './loading'

describe('LoadingSpinner', () => {
  it('renders with default size', () => {
    render(<LoadingSpinner />)
    const spinner = screen.getByRole('status', { hidden: true })
    expect(spinner).toBeInTheDocument()
  })

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Loading data..." />)
    expect(screen.getByText('Loading data...')).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />)
    expect(screen.getByRole('status', { hidden: true })).toHaveClass('h-4 w-4')

    rerender(<LoadingSpinner size="lg" />)
    expect(screen.getByRole('status', { hidden: true })).toHaveClass(
      'h-12 w-12',
    )
  })

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-class" />)
    expect(screen.getByTestId('loading-spinner')).toHaveClass('custom-class')
  })
})

describe('LoadingCard', () => {
  it('renders with title and description', () => {
    render(
      <LoadingCard title="Loading Title" description="Loading description" />,
    )
    expect(screen.getByText('Loading Title')).toBeInTheDocument()
    expect(screen.getByText('Loading description')).toBeInTheDocument()
  })

  it('renders without title and description', () => {
    render(<LoadingCard />)
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()
  })
})

describe('LoadingButton', () => {
  it('shows loading spinner when loading is true', () => {
    render(<LoadingButton loading={true}>Submit</LoadingButton>)
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  it('does not show loading spinner when loading is false', () => {
    render(<LoadingButton loading={false}>Submit</LoadingButton>)
    expect(
      screen.queryByRole('status', { hidden: true }),
    ).not.toBeInTheDocument()
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })
})

describe('LoadingGrid', () => {
  it('renders default number of loading cards', () => {
    render(<LoadingGrid />)
    const cards = screen.getAllByRole('status', { hidden: true })
    expect(cards).toHaveLength(6) // default count
  })

  it('renders custom number of loading cards', () => {
    render(<LoadingGrid count={3} />)
    const cards = screen.getAllByRole('status', { hidden: true })
    expect(cards).toHaveLength(3)
  })
})
