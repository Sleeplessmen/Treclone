'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from '@/lib/validation/auth';

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send reset email');
      }

      setSuccess(true);
      reset();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An error occurred';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-gap-md">
        <div className="p-gap-lg bg-success-container/20 border border-green-300 rounded-sm">
          <p className="text-green-700 font-medium">Check your email</p>
          <p className="text-sm text-green-600 mt-gap-sm">
            If an account exists for that email, you'll receive a password reset
            link.
          </p>
        </div>
        <p className="text-label-sm text-ink-muted">
          The reset link will expire in 1 hour.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-gap-md">
      <div className="space-y-gap-sm">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          {...register('email')}
          disabled={isLoading}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      {apiError && (
        <div className="p-gap-md bg-error-container/10 border border-destructive rounded-sm">
          <p className="text-destructive text-sm font-medium">{apiError}</p>
        </div>
      )}

      <Button
        variant="default"
        className="w-full"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </Button>
    </form>
  );
}
