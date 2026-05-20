import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ForgotPasswordPage from '@/app/(auth)/forgot-password/page';

// Mock the forgot password form wrapper
vi.mock('@/app/(auth)/forgot-password/_forgot-password-form-wrapper', () => ({
  ForgotPasswordFormWrapper: () => (
    <div data-testid="forgot-password-form-wrapper">Forgot Password Form</div>
  ),
}));

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the forgot password form wrapper', () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByTestId('forgot-password-form-wrapper')).toBeDefined();
  });

  it('should render without crashing', () => {
    const { container } = render(<ForgotPasswordPage />);
    expect(container).toBeDefined();
  });
});
