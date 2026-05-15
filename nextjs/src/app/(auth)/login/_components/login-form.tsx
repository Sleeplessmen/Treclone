'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { loginSchema, type LoginInput } from '@/lib/validation/auth';

export function UserLoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      router.push('/workspaces');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An error occurred';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

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

      <div className="space-y-gap-sm">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/auth/forgot-password"
            className="text-label-sm text-primary hover:text-primary-container"
          >
            Forgot?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          disabled={isLoading}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
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
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
