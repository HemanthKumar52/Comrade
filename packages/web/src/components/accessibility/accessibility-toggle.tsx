'use client';
import * as React from 'react';
import { Accessibility, Contrast, Type, Monitor, UserCircle } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface AccessibilitySetting {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
}

interface AccessibilityToggleProps {
  settings?: Record<string, boolean>;
  onChange?: (key: string, enabled: boolean) => void;
}

const defaultSettings: Omit<AccessibilitySetting, 'enabled'>[] = [
  {
    key: 'wheelchair',
    label: 'Wheelchair Mode',
    description: 'Show wheelchair-accessible routes, restaurants, and hotels',
    icon: Accessibility,
  },
  {
    key: 'highContrast',
    label: 'High Contrast',
    description: 'Increase contrast between foreground and background colors',
    icon: Contrast,
  },
  {
    key: 'largeText',
    label: 'Large Text',
    description: 'Increase text size throughout the application',
    icon: Type,
  },
  {
    key: 'screenReader',
    label: 'Screen Reader',
    description: 'Optimize content and navigation for screen readers',
    icon: Monitor,
  },
  {
    key: 'seniorMode',
    label: 'Senior Mode',
    description: 'Simplified interface with larger buttons and clear navigation',
    icon: UserCircle,
  },
];

export function AccessibilityToggle({ settings = {}, onChange }: AccessibilityToggleProps) {
  const [localSettings, setLocalSettings] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    defaultSettings.forEach((s) => {
      initial[s.key] = settings[s.key] ?? false;
    });
    return initial;
  });

  const handleToggle = (key: string) => {
    const newValue = !localSettings[key];
    setLocalSettings((prev) => ({ ...prev, [key]: newValue }));
    onChange?.(key, newValue);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Accessibility className="h-5 w-5 text-accent" />
          Accessibility
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {defaultSettings.map((setting) => {
            const Icon = setting.icon;
            const enabled = localSettings[setting.key] ?? false;

            return (
              <div
                key={setting.key}
                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {setting.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {setting.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={() => handleToggle(setting.key)}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
