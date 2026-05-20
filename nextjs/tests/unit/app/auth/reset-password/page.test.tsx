import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResetPasswordPage from '@/app/(auth)/reset-password/page';

// Mock the reset password form wrapper
vi.mock('@/app/(auth)/reset-password/_reset-password-form-wrapper', () => ({
  ResetPasswordFormWrapper: () => (
    <div data-testid="reset-password-form-wrapper">Reset Password Form</div>
  ),
}));

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the reset password form wrapper', () => {
    render(<ResetPasswordPage />);
    expect(screen.getByTestId('reset-password-form-wrapper')).toBeDefined();
  });

  it('should render without crashing', () => {
    const { container } = render(<ResetPasswordPage />);
    expect(container).toBeDefined();
  });
});
