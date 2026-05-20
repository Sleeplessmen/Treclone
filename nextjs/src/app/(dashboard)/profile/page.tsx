'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth/use-auth';
import { useProfile } from '@/hooks/profile';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Edit2 } from 'lucide-react';
import { EditProfileModal } from './_components/edit-profile-modal';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  if (authLoading || profileLoading) {
    return (
      <main className="max-w-4xl mx-auto space-y-gap-lg">
        <Card>
          <CardHeader>
            <div className="flex gap-gap-lg">
              <Skeleton className="w-20 h-20 rounded-md" />
              <div className="flex-1 space-y-gap-sm">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </main>
    );
  }

  if (!user || !profileData?.data) {
    return null;
  }

  const profile = profileData.data;

  return (
    <main className="max-w-4xl mx-auto space-y-gap-lg">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex gap-gap-lg items-start">
              {/* Avatar */}
              <div className="w-20 h-20 bg-primary rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                <span className="text-4xl font-heading text-white">
                  {profile.fullName.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* User Info */}
              <div className="space-y-gap-sm">
                <div>
                  <h1 className="text-headline-lg font-heading text-ink">
                    {profile.fullName}
                  </h1>
                  <p className="text-body text-ink-muted">{profile.email}</p>
                </div>
                <p className="text-label-sm text-ink-muted">
                  Account created on{' '}
                  {new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit2 className="h-4 w-4 mr-gap-sm" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-gap-lg">
          {/* Full Name */}
          <div>
            <Label className="text-label-sm font-semibold text-ink mb-gap-xs">
              Full Name
            </Label>
            <p className="text-body text-ink-muted">{profile.fullName}</p>
          </div>

          {/* Email */}
          <div>
            <Label className="text-label-sm font-semibold text-ink mb-gap-xs">
              Email Address
            </Label>
            <p className="text-body text-ink-muted">{profile.email}</p>
          </div>

          {/* Account Status */}
          <div>
            <Label className="text-label-sm font-semibold text-ink mb-gap-xs">
              Account Status
            </Label>
            <div className="flex items-center gap-gap-sm">
              <Badge variant="success">Active</Badge>
            </div>
          </div>

          {/* Last Updated */}
          <div>
            <Label className="text-label-sm font-semibold text-ink mb-gap-xs">
              Last Updated
            </Label>
            <p className="text-body text-ink-muted">
              {new Date(profile.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* User ID */}
          <div>
            <Label className="text-label-sm font-semibold text-ink mb-gap-xs">
              User ID
            </Label>
            <p className="text-body text-ink-muted font-mono text-xs break-all">
              {profile.id}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={profile}
      />
    </main>
  );
}
