import React, { useState } from 'react';
import { Shield, Lock, AlertCircle, CheckCircle, X, ChevronLeft, Key } from '../icon';
import { AuthService } from '../../services/auth';

const SecuritySettings = ({ user, onBack }) => {
  const [view, setView] = useState('main'); // 'main', 'change-password', '2fa-setup'
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
  const [backupCodes, setBackupCodes] = useState(null);

  const handlePasswordChange = () => {
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const result = AuthService.changePassword(user.email, currentPassword, newPassword);

    if (result.success) {
      setSuccess(result.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setView('main'), 2000);
    } else {
      setError(result.error);
    }
  };

  const handleToggle2FA = () => {
    const result = AuthService.toggle2FA(user.id, !twoFactorEnabled);

    if (result.success) {
      setTwoFactorEnabled(!twoFactorEnabled);
      if (!twoFactorEnabled) {
        setBackupCodes(result.backupCodes);
        setView('2fa-setup');
      } else {
        setSuccess('Two-factor authentication disabled');
      }
    } else {
      setError(result.error);
    }
  };

  // Main view
  if (view === 'main') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-stone-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Shield className="w-6 h-6 text-amber-500" />
                Security
              </h1>
              <p className="text-stone-400 text-sm">Manage your account security settings</p>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-4 bg-green-900/30 border border-green-500/50 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-green-200 text-sm">{success}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Change Password */}
            <button
              onClick={() => setView('change-password')}
              className="w-full bg-stone-900/60 backdrop-blur-sm border border-stone-700 hover:bg-stone-800/60 rounded-xl p-4 transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-amber-500" />
                  <div>
                    <div className="text-white font-medium">Change Password</div>
                    <div className="text-stone-400 text-sm">Update your password</div>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-stone-500 rotate-180" />
              </div>
            </button>

            {/* Two-Factor Authentication */}
            <div className="bg-stone-900/60 backdrop-blur-sm border border-stone-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-amber-500" />
                  <div>
                    <div className="text-white font-medium">Two-Factor Authentication</div>
                    <div className="text-stone-400 text-sm">
                      {twoFactorEnabled ? 'Enabled' : 'Add an extra layer of security'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleToggle2FA}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    twoFactorEnabled ? 'bg-green-600' : 'bg-stone-600'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    twoFactorEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-200">
                  <p className="font-medium mb-1">Security Tips</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-300">
                    <li>Use a strong, unique password</li>
                    <li>Enable two-factor authentication</li>
                    <li>Never share your password with anyone</li>
                    <li>Review your active sessions regularly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Change Password View
  if (view === 'change-password') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 p-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setView('main')}
              className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-stone-400" />
            </button>
            <h1 className="text-2xl font-bold text-white">Change Password</h1>
          </div>

          {/* Form */}
          <div className="bg-stone-900/60 backdrop-blur-sm border border-stone-700 rounded-xl p-6 space-y-4">
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter new password"
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Confirm new password"
                minLength={6}
              />
            </div>

            <button
              onClick={handlePasswordChange}
              className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2FA Setup View
  if (view === '2fa-setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 p-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setView('main')}
              className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-stone-400" />
            </button>
            <h1 className="text-2xl font-bold text-white">2FA Enabled</h1>
          </div>

          <div className="bg-stone-900/60 backdrop-blur-sm border border-green-700/50 rounded-xl p-6 space-y-4">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Two-Factor Authentication Enabled!</h2>
              <p className="text-stone-400 text-sm">Save these backup codes in a safe place</p>
            </div>

            <div className="bg-stone-800 border border-stone-700 rounded-lg p-4">
              <p className="text-stone-300 text-sm font-medium mb-3">Backup Codes:</p>
              <div className="grid grid-cols-2 gap-2">
                {backupCodes && backupCodes.map((code, i) => (
                  <div key={i} className="font-mono text-sm text-amber-400 bg-stone-900 px-3 py-2 rounded border border-stone-700">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-200">
                  Store these backup codes securely. You'll need them if you lose access to your authentication device.
                </p>
              </div>
            </div>

            <button
              onClick={() => setView('main')}
              className="w-full bg-gradient-to-r from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SecuritySettings;
