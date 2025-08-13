import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="default">Default</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary')

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="default">Default</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-9')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-10')
  })

  it('shows loading state when isLoading is true', () => {
    render(
      <Button isLoading loadingText="Loading...">
        Submit
      </Button>,
    )

    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Submit')).not.toBeInTheDocument()
  })

  it('shows children when not loading', () => {
    render(<Button isLoading={false}>Submit</Button>)

    expect(screen.getByRole('button')).not.toBeDisabled()
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  it('is disabled when isLoading is true', () => {
    render(<Button isLoading>Submit</Button>)

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('can be disabled independently of loading state', () => {
    render(<Button disabled>Submit</Button>)

    expect(screen.getByRole('button')).toBeDisabled()
  })
})
