'use client';

import { useState } from 'react';

interface Setting {
  id: string;
  label: string;
  description: string;
  value: string | boolean;
  type: 'text' | 'toggle' | 'select';
  options?: { value: string; label: string }[];
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([
    {
      id: 'store_name',
      label: 'Store Name',
      description: 'Your store display name',
      value: 'Plasticprecious',
      type: 'text',
    },
    {
      id: 'store_email',
      label: 'Store Email',
      description: 'Email for customer inquiries',
      value: 'contact@plasticprecious.com',
      type: 'text',
    },
    {
      id: 'notification_emails',
      label: 'Receive Order Notifications',
      description: 'Get email alerts for new orders',
      value: true,
      type: 'toggle',
    },
    {
      id: 'maintenance_mode',
      label: 'Maintenance Mode',
      description: 'Temporarily close the store',
      value: false,
      type: 'toggle',
    },
  ]);

  const handleChange = (id: string, value: string | boolean) => {
    setSettings(settings.map((s) => (s.id === id ? { ...s, value } : s)));
  };

  const handleSave = () => {
    // TODO: Save settings to backend
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your store configuration</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h2>
          <div className="space-y-6">
            {settings.map((setting) => (
              <div key={setting.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-gray-900">{setting.label}</label>
                    <p className="text-xs text-gray-500 mt-1">{setting.description}</p>
                  </div>

                  {setting.type === 'text' && (
                    <input
                      type="text"
                      value={setting.value}
                      onChange={(e) => handleChange(setting.id, e.target.value)}
                      className="ml-4 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  )}

                  {setting.type === 'toggle' && (
                    <button
                      onClick={() => handleChange(setting.id, !setting.value)}
                      className={`ml-4 px-3 py-2 rounded-lg text-xs font-medium transition ${
                        setting.value
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {setting.value ? 'ON' : 'OFF'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-green-50 rounded-lg border border-green-200 p-6">
          <h2 className="text-lg font-semibold text-green-900 mb-4">Danger Zone</h2>
          <div className="space-y-3">
            <p className="text-sm text-green-800">Irreversible and destructive actions</p>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition">
              Clear Cache
            </button>
            <button className="ml-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition">
              Reset to Default
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
        >
          Save Changes
        </button>
        <button className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition">
          Cancel
        </button>
      </div>
    </div>
  );
}
