import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '@/app/(auth)/login/page';

// Mock the login form wrapper
vi.mock('@/app/(auth)/login/_login-form-wrapper', () => ({
  LoginFormWrapper: () => (
    <div data-testid="login-form-wrapper">Login Form</div>
  ),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the login form wrapper', () => {
    render(<LoginPage />);
    expect(screen.getByTestId('login-form-wrapper')).toBeDefined();
  });

  it('should render without crashing', () => {
    const { container } = render(<LoginPage />);
    expect(container).toBeDefined();
  });
});
