'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  usePreferencesSettings,
  useUpdatePreferences,
} from '@/hooks/preferences';

interface Preferences {
  emailNotifications: boolean;
  darkMode: boolean;
}

export function PreferencesSettings() {
  const { setTheme } = useTheme();
  const { data: preferences, isLoading } = usePreferencesSettings();
  const updatePreference = useUpdatePreferences();

  const [localPreferences, setLocalPreferences] = useState<Preferences>({
    emailNotifications: true,
    darkMode: false,
  });

  // Keep a snapshot of server preferences for cancel/dirty detection
  const serverPreferences = useMemo(
    () =>
      preferences
        ? {
            emailNotifications: !!preferences.emailNotifications,
            darkMode: !!preferences.darkMode,
          }
        : null,
    [preferences]
  );

  // initialize local state from server when loaded
  useEffect(() => {
    if (serverPreferences) {
      setLocalPreferences(serverPreferences);
      // keep theme in sync with server on load only
      setTheme(serverPreferences.darkMode ? 'dark' : 'light');
    }
  }, [serverPreferences, setTheme]);

  // determine whether user changed anything
  const isDirty = useMemo(() => {
    if (!serverPreferences) return false;
    return (
      serverPreferences.darkMode !== localPreferences.darkMode ||
      serverPreferences.emailNotifications !==
        localPreferences.emailNotifications
    );
  }, [localPreferences, serverPreferences]);

  const handleToggleLocal = (key: keyof Preferences) => {
    setLocalPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCancel = () => {
    if (serverPreferences) {
      setLocalPreferences(serverPreferences);
    }
  };

  const handleSave = async () => {
    updatePreference.mutate(localPreferences, {
      onSuccess: () => {
        setTheme(localPreferences.darkMode ? 'dark' : 'light');
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Customize your experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-gap-md">
        <div className="flex items-center justify-between py-gap-sm">
          <div>
            <p className="text-body text-ink font-medium">
              Email Notifications
            </p>
            <p className="text-label-sm text-ink-muted">
              Receive updates about your boards
            </p>
          </div>
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={localPreferences.emailNotifications}
            onChange={() => handleToggleLocal('emailNotifications')}
            disabled={isLoading || updatePreference.isPending}
            aria-label="Toggle email notifications"
          />
        </div>

        <div className="flex items-center justify-between py-gap-sm border-t border-hairline-ghost pt-gap-md">
          <div>
            <p className="text-body text-ink font-medium">Dark Mode</p>
            <p className="text-label-sm text-ink-muted">
              Use dark theme by default
            </p>
          </div>
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={localPreferences.darkMode}
            onChange={() => handleToggleLocal('darkMode')}
            disabled={isLoading || updatePreference.isPending}
            aria-label="Toggle dark mode"
          />
        </div>

        <div className="pt-gap-md border-t border-transparent">
          <div className="mt-gap-sm flex items-center justify-end gap-gap-sm">
            <Button
              variant="ghost"
              onClick={handleCancel}
              disabled={!isDirty || updatePreference.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              disabled={!isDirty || updatePreference.isPending}
            >
              {updatePreference.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
