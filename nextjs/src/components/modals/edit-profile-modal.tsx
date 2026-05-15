'use client';

import { useState, useEffect } from 'react';
import { useUpdateProfile } from '@/hooks/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserProfile {
  fullName: string;
  email: string;
}

interface EditProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({
  user,
  isOpen,
  onClose,
}: EditProfileModalProps) {
  const [fullName, setFullName] = useState(user.fullName);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const updateProfile = useUpdateProfile();

  useEffect(() => {
    setFullName(user.fullName);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({
        fullName: fullName !== user.fullName ? fullName : undefined,
        password: password ? password : undefined,
        passwordConfirmation: passwordConfirmation
          ? passwordConfirmation
          : undefined,
      });
      setPassword('');
      setPasswordConfirmation('');
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface-2 rounded-md p-6 w-full max-w-md">
        <h2 className="text-headline-sm mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-canvas text-ink-muted"
            />
          </div>
          <div>
            <Label htmlFor="password">New Password (Optional)</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
            />
          </div>
          {password && (
            <div>
              <Label htmlFor="passwordConfirmation">Confirm Password</Label>
              <Input
                id="passwordConfirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
