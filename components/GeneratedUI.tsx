import React, { useState } from 'react';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface NotificationPreference {
  id: string;
  userId: string;
  notificationsEnabled: boolean;
  notificationFrequency: string;
}

interface UserProfileFormProps {
  firstName: string;
  lastName: string;
  email: string;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

interface NotificationPreferencesProps {
  notificationsEnabled: boolean;
  notificationFrequency: string;
  onChange: (field: string, value: string | boolean) => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({
  firstName,
  lastName,
  email,
  onChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }} className="mt-8 space-y-6" aria-label="User Profile Form">
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => onChange('email', e.target.value)}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update Profile
        </button>
      </div>
    </form>
  );
};

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  notificationsEnabled,
  notificationFrequency,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="notificationsEnabled"
            name="notificationsEnabled"
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => onChange('notificationsEnabled', e.target.checked)}
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
          />
        </div>
        <div className="ml-3">
          <label htmlFor="notificationsEnabled" className="text-sm font-medium text-gray-700">Notifications enabled</label>
        </div>
      </div>
      <div>
        <label htmlFor="notificationFrequency" className="block text-sm font-medium text-gray-700">Notification frequency</label>
        <select
          id="notificationFrequency"
          name="notificationFrequency"
          value={notificationFrequency}
          onChange={(e) => onChange('notificationFrequency', e.target.value)}
          className="mt-1 block w-full pl-10 py-2 text-sm text-gray-700 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationFrequency, setNotificationFrequency] = useState('');

  const handleUserProfileChange = (field: string, value: string) => {
    switch (field) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      default:
        break;
    }
  };

  const handleNotificationPreferencesChange = (field: string, value: string | boolean) => {
    switch (field) {
      case 'notificationsEnabled':
        setNotificationsEnabled(value as boolean);
        break;
      case 'notificationFrequency':
        setNotificationFrequency(value as string);
        break;
      default:
        break;
    }
  };

  const handleUserProfileSubmit = () => {
    console.log('User profile submitted:', { firstName, lastName, email });
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
      <div className="mt-8 space-y-6">
        <UserProfileForm
          firstName={firstName}
          lastName={lastName}
          email={email}
          onChange={handleUserProfileChange}
          onSubmit={handleUserProfileSubmit}
        />
        <NotificationPreferences
          notificationsEnabled={notificationsEnabled}
          notificationFrequency={notificationFrequency}
          onChange={handleNotificationPreferencesChange}
        />
      </div>
    </div>
  );
};

const GeneratedUI: React.FC = () => {
  return (
    <div>
      <SettingsPage />
    </div>
  );
};

export default GeneratedUI;