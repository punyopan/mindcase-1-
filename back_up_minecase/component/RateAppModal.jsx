import React, { useEffect, useState } from 'react';
import TranslationService from '../services/TranslationService';
import { X, Star } from './icon';

const RateAppModal = ({ onClose, userId }) => {
  const [, setLang] = useState(TranslationService.currentLang);

  useEffect(() => {
    const unsubscribe = TranslationService.subscribe((lang) => setLang(lang));
    return () => unsubscribe();
  }, []);

  const handleRateNow = () => {
    if (window.RateAppService) {
      window.RateAppService.onRateNow();
    }
    onClose();
  };

  const handleMaybeLater = () => {
    if (window.RateAppService) {
      window.RateAppService.onMaybeLater(userId);
    }
    onClose();
  };

  const handleNoThanks = () => {
    if (window.RateAppService) {
      window.RateAppService.onNoThanks();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 border-2 border-amber-700/50 rounded-2xl w-full max-w-md shadow-2xl animate-fadeInScale">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 to-yellow-900 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              {TranslationService.t('modals.rate_app_title')}
            </h2>
            <button
              onClick={handleNoThanks}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Message */}
          <div className="bg-gradient-to-br from-amber-900/30 to-yellow-900/30 border-2 border-amber-600/50 rounded-xl p-6 text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-2xl font-bold text-amber-400 mb-2">
              {TranslationService.t('modals.rate_app_enjoying')}
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              {TranslationService.t('modals.rate_app_desc')}
            </p>
          </div>

          {/* Star Rating Preview */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star} 
                className="text-3xl animate-pulse"
                style={{ animationDelay: `${star * 0.1}s` }}
              >
                ⭐
              </span>
            ))}
          </div>

          {/* Rate Now Button */}
          <button
            onClick={handleRateNow}
            className="w-full font-bold py-4 px-6 rounded-lg transition-all text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Star className="w-5 h-5" />
            {TranslationService.t('modals.rate_app_now')}
          </button>

          {/* Maybe Later Button */}
          <button
            onClick={handleMaybeLater}
            className="w-full font-semibold py-3 px-6 rounded-lg transition-all text-base bg-stone-700 hover:bg-stone-600 text-stone-200 border border-stone-600"
          >
            {TranslationService.t('modals.rate_app_later')}
          </button>

          {/* No Thanks Link */}
          <div className="text-center">
            <button
              onClick={handleNoThanks}
              className="text-stone-500 hover:text-stone-400 text-sm underline transition-colors"
            >
              {TranslationService.t('modals.rate_app_no')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateAppModal;
