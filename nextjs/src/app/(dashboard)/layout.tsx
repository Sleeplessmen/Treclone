'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth/use-auth';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex bg-canvas min-h-screen">
      {/* Sidebar - Level 1 Surface */}
      <aside className="w-64 bg-surface-1 p-gap-md border-r border-hairline-ghost flex flex-col gap-gap-lg sticky top-0 h-screen overflow-y-auto">
        {/* Logo/Brand */}
        <div className="flex items-center gap-gap-sm">
          <div className="w-8 h-8 bg-primary rounded-sm" />
          <h2 className="text-headline-sm font-heading text-ink">Treclone</h2>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-gap-sm flex-1">
          <Link
            href="/workspaces"
            className="text-body text-ink px-gap-md py-gap-sm rounded-sm hover:bg-canvas transition-colors"
          >
            Workspaces
          </Link>
          <Link
            href="/settings"
            className="text-body text-ink px-gap-md py-gap-sm rounded-sm hover:bg-canvas transition-colors"
          >
            Settings
          </Link>
        </nav>

        {/* User Menu */}
        <div className="pt-gap-md border-t border-hairline-ghost space-y-gap-md">
          {user ? (
            <>
              {/* User Profile - Clickable */}
              <Link
                href="/profile"
                className="block px-gap-md py-gap-sm rounded-sm hover:bg-canvas transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-gap-sm mb-gap-sm">
                  {/* Avatar */}
                  <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center flex-shrink-0 group-hover:ring-2 group-hover:ring-primary transition-all">
                    <span className="text-xs font-heading text-white">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-label-sm font-semibold text-ink truncate group-hover:text-primary transition-colors">
                      {user.fullName}
                    </p>
                    <p className="text-label-xs text-ink-muted truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </Link>

              {/* Logout Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
                disabled={isLoading}
                size="sm"
              >
                {isLoading ? 'Logging out...' : 'Logout'}
              </Button>
            </>
          ) : (
            <p className="text-label-sm text-ink-muted text-center">
              Loading...
            </p>
          )}
        </div>
      </aside>

      {/* Main Content Area - Canvas Level */}
      <main className="flex-1 p-gap-xl overflow-auto">{children}</main>
    </div>
  );
}
