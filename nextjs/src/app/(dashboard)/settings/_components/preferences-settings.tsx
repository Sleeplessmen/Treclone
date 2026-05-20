'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Preferences {
  emailNotifications: boolean;
  darkMode: boolean;
}

export function PreferencesSettings() {
  const [preferences, setPreferences] = useState<Preferences>({
    emailNotifications: true,
    darkMode: false,
  });

  useEffect(() => {
    // Fetch preferences from API
    const fetchPreferences = async () => {
      try {
        const response = await fetch('/api/settings/preferences');
        if (response.ok) {
          const data = await response.json();
          setPreferences(data);
        }
      } catch (error) {
        console.error('Failed to fetch preferences:', error);
      }
    };

    fetchPreferences();
  }, []);

  const handleToggle = async (key: keyof Preferences) => {
    const newValue = !preferences[key];
    setPreferences({ ...preferences, [key]: newValue });

    // Save to API
    await fetch('/api/settings/preferences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: newValue }),
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
            checked={preferences.emailNotifications}
            onChange={() => handleToggle('emailNotifications')}
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
            checked={preferences.darkMode}
            onChange={() => handleToggle('darkMode')}
          />
        </div>
      </CardContent>
    </Card>
  );
}
