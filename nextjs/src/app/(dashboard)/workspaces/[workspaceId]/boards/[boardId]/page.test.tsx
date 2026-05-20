import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BoardPage from './page';
import * as navigationModule from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: vi.fn(),
}));

// Mock KanbanBoard component
vi.mock('./_components/kanban-board', () => ({
  KanbanBoard: ({ boardId, workspaceId }: any) => (
    <div data-testid="kanban-board">
      KanbanBoard: {boardId} - {workspaceId}
    </div>
  ),
}));

describe('BoardPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('should render KanbanBoard with correct props', () => {
    // Mock the params
    vi.mocked(navigationModule.useParams).mockReturnValue({
      workspaceId: 'ws-123',
      boardId: 'board-456',
    } as any);

    render(<BoardPage />);

    expect(screen.getByTestId('kanban-board')).toBeDefined();
    expect(screen.getByText(/board-456 - ws-123/)).toBeDefined();
  });

  it('should handle missing params gracefully', () => {
    vi.mocked(navigationModule.useParams).mockReturnValue({} as any);

    render(<BoardPage />);
    // Test what happens when params are missing
  });

  it('should render main with correct className', () => {
    vi.mocked(navigationModule.useParams).mockReturnValue({
      workspaceId: 'ws-123',
      boardId: 'board-456',
    } as any);

    const { container } = render(<BoardPage />);
    const main = container.querySelector('main');

    expect(main?.className).toContain('space-y-gap-lg');
  });
});
