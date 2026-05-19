'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from '@/lib/validation/auth';

interface UserProfile {
  readonly id: string;
  readonly email: string;
  readonly fullName: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface EditProfileModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (data: UpdateProfileInput) => void;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly user: UserProfile;
}

export function EditProfileModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error,
  user,
}: EditProfileModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: user.fullName,
    },
  });

  const password = watch('password');

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: UpdateProfileInput) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and password
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-gap-md"
        >
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
              <p className="text-destructive text-sm">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-hairline-ghost" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-gap-sm text-ink-muted">
                Change Password (Optional)
              </span>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-gap-sm">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              disabled={isLoading}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-destructive text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          {password && (
            <div className="space-y-gap-sm">
              <Label htmlFor="passwordConfirmation">Confirm Password</Label>
              <Input
                id="passwordConfirmation"
                type="password"
                placeholder="••••••••"
                {...register('passwordConfirmation')}
                disabled={isLoading}
                aria-invalid={!!errors.passwordConfirmation}
              />
              {errors.passwordConfirmation && (
                <p className="text-destructive text-sm">
                  {errors.passwordConfirmation.message}
                </p>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-gap-md bg-error-container/10 border border-destructive rounded-sm">
              <p className="text-destructive text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-gap-sm justify-end pt-gap-md">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
