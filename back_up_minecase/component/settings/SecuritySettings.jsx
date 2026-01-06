import React, { useState, useEffect } from 'react';
import { Shield, Lock, AlertCircle, CheckCircle, X, ChevronLeft, Key } from '../icon';
import { AuthService } from '../../services/auth';

const SecuritySettings = ({ user, onBack }) => {
  const [view, setView] = useState('main'); // 'main', 'change-password', '2fa-setup', '2fa-verify'
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [backupCodes, setBackupCodes] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');

  // Check 2FA status on mount
  useEffect(() => {
    const check2FAStatus = async () => {
      const enabled = await AuthService.get2FAStatus();
      setTwoFactorEnabled(enabled);
    };
    check2FAStatus();
  }, []);

  const handlePasswordChange = async () => {
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    const result = await AuthService.changePassword(currentPassword, newPassword);
    setLoading(false);

    if (result.success) {
      setSuccess(result.message || 'Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setView('main'), 2000);
    } else {
      setError(result.error);
    }
  };

  const handleEnable2FA = async () => {
    setError('');
    setLoading(true);
    const result = await AuthService.setup2FA();
    setLoading(false);

    if (result.success) {
      setQrCode(result.qrCode);
      setView('2fa-setup');
    } else {
      setError(result.error);
    }
  };

  const handleVerify2FA = async () => {
    setError('');
    setLoading(true);
    const result = await AuthService.verify2FASetup(verificationCode);
    setLoading(false);

    if (result.success) {
      setBackupCodes(result.backupCodes);
      setTwoFactorEnabled(true);
      setView('2fa-backup');
    } else {
      setError(result.error);
    }
  };

  const handleDisable2FA = async () => {
    setError('');
    setLoading(true);
    const result = await AuthService.disable2FA(disablePassword);
    setLoading(false);

    if (result.success) {
      setTwoFactorEnabled(false);
      setDisablePassword('');
      setSuccess('Two-factor authentication disabled');
      setView('main');
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
                  onClick={twoFactorEnabled ? () => setView('2fa-disable') : handleEnable2FA}
                  disabled={loading}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    twoFactorEnabled ? 'bg-green-600' : 'bg-stone-600'
                  } ${loading ? 'opacity-50' : ''}`}
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

  // 2FA Setup View - QR Code
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
            <h1 className="text-2xl font-bold text-white">Setup 2FA</h1>
          </div>

          <div className="bg-stone-900/60 backdrop-blur-sm border border-stone-700 rounded-xl p-6 space-y-4">
            <div className="text-center">
              <Shield className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-white mb-2">Scan QR Code</h2>
              <p className="text-stone-400 text-sm">
                Use Google Authenticator or any TOTP app to scan this code
              </p>
            </div>

            {/* QR Code */}
            {qrCode && (
              <div className="bg-white p-4 rounded-lg mx-auto w-fit">
                <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
              </div>
            )}

            {/* Verification Code Input */}
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">
                Enter 6-digit code from app
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="000000"
                maxLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleVerify2FA}
              disabled={loading || verificationCode.length !== 6}
              className={`w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-all ${
                loading || verificationCode.length !== 6 ? 'opacity-50 cursor-not-allowed' : 'hover:from-amber-500 hover:to-amber-600'
              }`}
            >
              {loading ? 'Verifying...' : 'Verify & Enable'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2FA Backup Codes View
  if (view === '2fa-backup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-white">2FA Enabled!</h1>
          </div>

          <div className="bg-stone-900/60 backdrop-blur-sm border border-green-700/50 rounded-xl p-6 space-y-4">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Save Your Backup Codes</h2>
              <p className="text-stone-400 text-sm">Store these codes securely - you'll need them if you lose your device</p>
            </div>

            <div className="bg-stone-800 border border-stone-700 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-2">
                {backupCodes && backupCodes.map((code, i) => (
                  <div key={i} className="font-mono text-sm text-amber-400 bg-stone-900 px-3 py-2 rounded border border-stone-700 text-center">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-200">
                  Each code can only be used once. Store them securely!
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

  // 2FA Disable View
  if (view === '2fa-disable') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setView('main')}
              className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-stone-400" />
            </button>
            <h1 className="text-2xl font-bold text-white">Disable 2FA</h1>
          </div>

          <div className="bg-stone-900/60 backdrop-blur-sm border border-red-700/50 rounded-xl p-6 space-y-4">
            <div className="text-center">
              <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-stone-400 text-sm">Enter your password to disable two-factor authentication</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleDisable2FA}
              disabled={loading || !disablePassword}
              className={`w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all ${
                loading || !disablePassword ? 'opacity-50 cursor-not-allowed' : 'hover:from-red-500 hover:to-red-600'
              }`}
            >
              {loading ? 'Disabling...' : 'Disable 2FA'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SecuritySettings;

