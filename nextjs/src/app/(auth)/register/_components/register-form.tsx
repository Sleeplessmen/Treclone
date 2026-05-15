'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  registerFormSchema,
  type RegisterFormValues,
} from '../_schemas/register-form.schema';

export function UserRegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
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
      {/* Full Name */}
      <div className="space-y-gap-sm">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="John Doe"
          {...register('fullName')}
          disabled={isLoading}
          aria-invalid={!!errors.fullName}
        />
        {errors.fullName && (
          <p className="text-destructive text-sm">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
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

      {/* Password */}
      <div className="space-y-gap-sm">
        <Label htmlFor="password">Password</Label>
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

      {/* API Error Container */}
      {apiError && (
        <div className="p-gap-md bg-error-container/20 border border-destructive/30 rounded-sm">
          <p className="text-destructive text-sm font-medium">{apiError}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        variant="default"
        className="w-full"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
}
