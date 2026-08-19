'use client';

import { ProfileSettings } from './_components/profile-settings';
import { SecuritySettings } from './_components/security-settings';
import { PreferencesSettings } from './_components/preferences-settings';
import { DangerZone } from './_components/danger-zone';

export default function SettingsPage() {
  return (
    <main className="max-w-4xl mx-auto space-y-gap-lg px-gap-md py-gap-lg">
      {/* Header */}
      <div className="space-y-gap-sm">
        <h1 className="text-headline-lg font-heading text-ink">Settings</h1>
        <p className="text-body text-ink-muted">
          Manage your account and preferences
        </p>
      </div>

      {/* Settings Components */}
      <ProfileSettings />
      <SecuritySettings />
      <PreferencesSettings />
      <DangerZone />
    </main>
  );
}
