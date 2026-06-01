import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BoardPage from '@/app/(dashboard)/workspaces/[workspaceId]/boards/[boardId]/page';
import { QueryClientProvider } from '@tanstack/react-query';
import * as navigationModule from 'next/navigation';

vi.mock('next/navigation', () => ({
  useParams: vi.fn(),
}));

vi.mock(
  '@/app/(dashboard)/workspaces/[workspaceId]/boards/[boardId]/_components/kanban-board',
  () => ({
    KanbanBoard: ({
      boardId,
      workspaceId,
    }: {
      boardId: string;
      workspaceId: string;
    }) => (
      <div data-testid="kanban-board">
        KanbanBoard: {boardId} - {workspaceId}
      </div>
    ),
  })
);

describe('BoardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={globalThis.queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it('should render KanbanBoard with correct props', () => {
    vi.mocked(navigationModule.useParams).mockReturnValue({
      workspaceId: 'ws-123',
      boardId: 'board-456',
    } as unknown as Record<string, string>);

    renderWithProviders(<BoardPage />);

    expect(screen.getByTestId('kanban-board')).toBeDefined();
    expect(screen.getByText(/board-456 - ws-123/)).toBeDefined();
  });

  it('should handle missing params gracefully', () => {
    vi.mocked(navigationModule.useParams).mockReturnValue(
      {} as unknown as Record<string, string>
    );

    renderWithProviders(<BoardPage />);
    // Component should render without crashing
    expect(screen.getByTestId('kanban-board')).toBeDefined();
  });

  it('should render main with correct className', () => {
    vi.mocked(navigationModule.useParams).mockReturnValue({
      workspaceId: 'ws-123',
      boardId: 'board-456',
    } as unknown as Record<string, string>);

    const { container } = renderWithProviders(<BoardPage />);
    const main = container.querySelector('main');

    expect(main?.className).toContain('space-y-gap-lg');
  });
});
