import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FaqAccordion } from './faq-accordion';

describe('FaqAccordion', () => {
  const mockItems = [
    { id: '1', question: 'What is this?', answer: 'This is the first answer.' },
    { id: '2', question: 'How does it work?', answer: 'It works great.' },
    { id: '3', question: 'Is it accessible?', answer: 'Yes, fully accessible.' },
  ];

  it('renders heading', () => {
    render(<FaqAccordion items={mockItems} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Frequently asked questions');
  });

  it('renders all questions', () => {
    render(<FaqAccordion items={mockItems} />);
    expect(screen.getByText('What is this?')).toBeInTheDocument();
    expect(screen.getByText('How does it work?')).toBeInTheDocument();
    expect(screen.getByText('Is it accessible?')).toBeInTheDocument();
  });

  it('does not render answers initially', () => {
    render(<FaqAccordion items={mockItems} />);
    expect(screen.queryByText('This is the first answer.')).not.toBeVisible();
  });

  it('expands answer on click', () => {
    render(<FaqAccordion items={mockItems} />);
    const firstButton = screen.getByText('What is this?').closest('button');
    fireEvent.click(firstButton!);
    expect(screen.getByText('This is the first answer.')).toBeVisible();
  });

  it('collapses answer on second click', () => {
    render(<FaqAccordion items={mockItems} />);
    const firstButton = screen.getByText('What is this?').closest('button');
    fireEvent.click(firstButton!);
    fireEvent.click(firstButton!);
    expect(screen.queryByText('This is the first answer.')).not.toBeVisible();
  });

  it('allows multiple items to be expanded', () => {
    render(<FaqAccordion items={mockItems} />);
    const firstButton = screen.getByText('What is this?').closest('button');
    const secondButton = screen.getByText('How does it work?').closest('button');
    fireEvent.click(firstButton!);
    fireEvent.click(secondButton!);
    expect(screen.getByText('This is the first answer.')).toBeVisible();
    expect(screen.getByText('It works great.')).toBeVisible();
  });

  it('renders custom heading', () => {
    render(<FaqAccordion items={mockItems} heading="Custom heading" />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Custom heading');
  });

  it('renders nothing for empty items', () => {
    const { container } = render(<FaqAccordion items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('has proper accessibility attributes', () => {
    render(<FaqAccordion items={mockItems} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('aria-expanded');
      expect(button).toHaveAttribute('aria-controls');
    });
  });

  it('sets aria-expanded to true when expanded', () => {
    render(<FaqAccordion items={mockItems} />);
    const firstButton = screen.getByText('What is this?').closest('button');
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(firstButton!);
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
  });
});
