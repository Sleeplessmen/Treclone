import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegisterPage from '@/app/(auth)/register/page';

// Mock the register form wrapper
vi.mock('@/app/(auth)/register/_register-form-wrapper', () => ({
  RegisterFormWrapper: () => (
    <div data-testid="register-form-wrapper">Register Form</div>
  ),
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the register form wrapper', () => {
    render(<RegisterPage />);
    expect(screen.getByTestId('register-form-wrapper')).toBeDefined();
  });

  it('should render without crashing', () => {
    const { container } = render(<RegisterPage />);
    expect(container).toBeDefined();
  });
});
