'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  boards: number;
  tasks: number;
  teamMembers: number;
  recentActivity: Array<{
    id: string;
    action: string;
    target: string;
    timestamp: string;
  }>;
}

export default function ProfilePage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          // Parse the profile data from response
          setProfile({
            boards: data.workspaces?.length || 0,
            tasks: 0,
            teamMembers: 0,
            recentActivity: [],
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  async function handleLogout() {
    await logout();
    router.push('/auth/login');
  }

  if (authLoading || isLoading) {
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

  if (!user) {
    return null;
  }

  return (
    <main className="max-w-4xl mx-auto space-y-gap-lg">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex gap-gap-lg items-start">
              {/* Avatar */}
              <div className="w-20 h-20 bg-primary rounded-md flex items-center justify-center">
                <span className="text-2xl font-heading text-white">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              {/* User Info */}
              <div className="space-y-gap-sm">
                <div>
                  <h1 className="text-headline-lg font-heading text-ink">
                    {user.fullName}
                  </h1>
                  <p className="text-body text-ink-muted">{user.email}</p>
                </div>
                <p className="text-label-sm text-ink-muted">
                  Member since {new Date(user.id).getFullYear()}
                </p>
              </div>
            </div>
            <div className="space-y-gap-sm">
              <Button variant="outline" size="sm">
                <Edit2 className="h-4 w-4 mr-gap-sm" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-gap-sm" />
                Logout
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-gap-lg">
        <Card>
          <CardContent className="pt-gap-lg text-center space-y-gap-sm">
            <div className="text-4xl font-heading text-primary">
              {profile?.boards || 0}
            </div>
            <p className="text-body text-ink-muted">Active Workspaces</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-gap-lg text-center space-y-gap-sm">
            <div className="text-4xl font-heading text-primary">
              {profile?.tasks || 0}
            </div>
            <p className="text-body text-ink-muted">Tasks Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-gap-lg text-center space-y-gap-sm">
            <div className="text-4xl font-heading text-primary">
              {profile?.teamMembers || 0}
            </div>
            <p className="text-body text-ink-muted">Team Members</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {profile?.recentActivity && profile.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-gap-md">
              {profile.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-gap-md border-b border-hairline-ghost last:border-b-0"
                >
                  <div>
                    <p className="text-body text-ink">
                      {activity.action}{' '}
                      <span className="font-semibold text-primary">
                        {activity.target}
                      </span>
                    </p>
                    <p className="text-label-sm text-ink-muted">
                      {activity.timestamp}
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
