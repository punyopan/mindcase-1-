import React, { useState } from 'react';
import TranslationService from '../../services/TranslationService';
import { AlertCircle, CheckCircle, Loader, User } from '../icon';

const SignupForm = ({ onSignup, onSwitchToLogin, onSkip }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Name is required';
    }
    if (!formData.email.trim()) {
      return 'Email is required';
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    // Simulate slight delay for better UX
    setTimeout(async () => {
      const result = await onSignup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (!result.success) {
        setError(result.error);
        setIsLoading(false);
      }
      // If success, parent component handles navigation
    }, 300);
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return null;
    if (password.length < 6) return { strength: 'weak', color: 'red' };
    if (password.length < 10) return { strength: 'medium', color: 'yellow' };
    return { strength: 'strong', color: 'green' };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🧠</div>
          <h1 className="text-3xl font-bold text-white mb-2">{TranslationService.t('auth.join_mindcase')}</h1>
          <p className="text-stone-400">{TranslationService.t('auth.create_track_progress')}</p>
        </div>

        {/* Signup Form */}
        <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-300 mb-2">
                {TranslationService.t('auth.full_name')}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="Sherlock Holmes"
                required
                disabled={isLoading}
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-300 mb-2">
                {TranslationService.t('auth.email_address')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="detective@mindcase.com"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-300 mb-2">
                {TranslationService.t('auth.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
                disabled={isLoading}
                minLength={6}
              />
              {/* Password Strength Indicator */}
              {strength && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-stone-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          strength.color === 'red' ? 'bg-red-500 w-1/3' :
                          strength.color === 'yellow' ? 'bg-yellow-500 w-2/3' :
                          'bg-green-500 w-full'
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      strength.color === 'red' ? 'text-red-400' :
                      strength.color === 'yellow' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {strength.strength}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-300 mb-2">
                {TranslationService.t('auth.confirm_password')}
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 disabled:from-stone-700 disabled:to-stone-800 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>{TranslationService.t('auth.creating_account')}</span>
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  <span>{TranslationService.t('auth.create_account')}</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-stone-900 text-stone-400">{TranslationService.t('auth.or')}</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-stone-400 text-sm">
              {TranslationService.t('auth.already_have_account')}{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                disabled={isLoading}
              >
                {TranslationService.t('auth.sign_in')}
              </button>
            </p>
          </div>

          {/* Skip/Guest Option */}
          {onSkip && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={onSkip}
                className="text-stone-500 hover:text-stone-400 text-sm transition-colors"
                disabled={isLoading}
              >
                {TranslationService.t('auth.continue_guest')}
              </button>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-center text-stone-600 text-xs mt-6">
          {TranslationService.t('auth.terms_agreement')}
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
