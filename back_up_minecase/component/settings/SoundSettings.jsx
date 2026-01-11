import React, { useState, useEffect } from 'react';
import { SoundService } from '../../services/sound';
import { ChevronLeft } from '../icon';

const SoundSettings = ({ onBack }) => {
  const [settings, setSettings] = useState(() => {
    try {
      return SoundService.getSettings();
    } catch (e) {
      return {
        bgMusicEnabled: true,
        bgMusicVolume: 0.3,
        sfxEnabled: true,
        sfxVolume: 0.5,
        selectedBgMusic: 'detective'
      };
    }
  });

  const handleBgMusicToggle = () => {
    try {
      const newValue = !settings.bgMusicEnabled;
      SoundService.setBgMusicEnabled(newValue);
      setSettings({ ...settings, bgMusicEnabled: newValue });
    } catch (e) {
      console.warn('Sound service error:', e);
    }
  };

  const handleSfxToggle = () => {
    try {
      const newValue = !settings.sfxEnabled;
      SoundService.setSfxEnabled(newValue);
      setSettings({ ...settings, sfxEnabled: newValue });
    } catch (e) {
      console.warn('Sound service error:', e);
    }
  };

  const handleBgMusicVolumeChange = (e) => {
    try {
      const volume = parseFloat(e.target.value);
      SoundService.setBgMusicVolume(volume);
      setSettings({ ...settings, bgMusicVolume: volume });
    } catch (e) {
      console.warn('Sound service error:', e);
    }
  };

  const handleSfxVolumeChange = (e) => {
    try {
      const volume = parseFloat(e.target.value);
      SoundService.setSfxVolume(volume);
      setSettings({ ...settings, sfxVolume: volume });
    } catch (e) {
      console.warn('Sound service error:', e);
    }
  };

  const handleBgMusicSelect = (musicType) => {
    try {
      SoundService.setSelectedBgMusic(musicType);
      setSettings({ ...settings, selectedBgMusic: musicType });
      SoundService.play('topicSelect');
    } catch (e) {
      console.warn('Sound service error:', e);
    }
  };

  const testSound = (soundName) => {
    try {
      SoundService.play(soundName);
    } catch (e) {
      console.warn('Sound service error:', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-stone-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-amber-400" />
        </button>
        <h2 className="text-2xl font-bold text-white">🎵 Sound Settings</h2>
      </div>

      {/* Background Music Section */}
      <div className="bg-stone-800 rounded-lg p-5 border border-stone-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold mb-1">Background Music</h3>
            <p className="text-stone-400 text-sm">Ambient detective music while you investigate</p>
          </div>
          <button
            onClick={handleBgMusicToggle}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              settings.bgMusicEnabled ? 'bg-green-600' : 'bg-stone-600'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                settings.bgMusicEnabled ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {settings.bgMusicEnabled && (
          <>
            {/* Volume Control */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-stone-300 text-sm">Volume</label>
                <span className="text-amber-400 text-sm font-medium">
                  {Math.round(settings.bgMusicVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.bgMusicVolume}
                onChange={handleBgMusicVolumeChange}
                className="w-full"
              />
            </div>

            {/* Music Selection */}
            <div>
              <label className="text-stone-300 text-sm mb-2 block">Music Theme</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'detective', name: '🕵️ Detective Theme', desc: 'Deep ocean mystery' },
                  { id: 'morning', name: '🌅 Morning Routine', desc: 'Relaxing lofi study beats' },
                  { id: 'thinking', name: '🧠 Thinking Theme', desc: 'Calm, dreamy focus' },
                  { id: 'mission', name: '🎯 Mission Theme', desc: 'Epic, driven atmosphere' },
                  { id: 'calm', name: '🌸 Calm Flowers', desc: 'Peaceful floral ambiance' },
                  { id: 'chill', name: '🍯 Chill Theme', desc: 'Smooth, relaxed vibe' },
                  { id: 'mud', name: '🎵 Mud Theme', desc: 'Raw, grounded feel' }
                ].map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleBgMusicSelect(theme.id)}
                    className={`text-left p-3 rounded-lg border-2 transition-all ${
                      settings.selectedBgMusic === theme.id
                        ? 'bg-amber-900/30 border-amber-500'
                        : 'bg-stone-700/50 border-stone-600 hover:border-amber-700/50'
                    }`}
                  >
                    <div className="text-white font-medium text-sm mb-1">{theme.name}</div>
                    <div className="text-stone-400 text-xs">{theme.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sound Effects Section */}
      <div className="bg-stone-800 rounded-lg p-5 border border-stone-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold mb-1">Sound Effects</h3>
            <p className="text-stone-400 text-sm">Interaction sounds and feedback</p>
          </div>
          <button
            onClick={handleSfxToggle}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              settings.sfxEnabled ? 'bg-green-600' : 'bg-stone-600'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                settings.sfxEnabled ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {settings.sfxEnabled && (
          <>
            {/* Volume Control */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-stone-300 text-sm">Volume</label>
                <span className="text-amber-400 text-sm font-medium">
                  {Math.round(settings.sfxVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.sfxVolume}
                onChange={handleSfxVolumeChange}
                className="w-full"
              />
            </div>

            {/* Test Sounds */}
            <div>
              <label className="text-stone-300 text-sm mb-2 block">Test Sounds</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'buttonClick', name: 'Button Click' },
                  { id: 'caseOpen', name: 'Case Open' },
                  { id: 'topicSelect', name: 'Topic Select' },
                  { id: 'evidenceUnlock', name: 'Evidence Unlock' },
                  { id: 'gameSuccess', name: 'Game Success' },
                  { id: 'puzzleComplete', name: 'Puzzle Complete' }
                ].map((sound) => (
                  <button
                    key={sound.id}
                    onClick={() => testSound(sound.id)}
                    className="text-sm bg-stone-700/50 hover:bg-stone-700 border border-stone-600 hover:border-amber-700/50 text-white py-2 px-3 rounded-lg transition-all"
                  >
                    {sound.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
        <p className="text-blue-300 text-sm">
          💡 <strong>Tip:</strong> Background music helps create an immersive detective atmosphere.
          Choose from 7 carefully selected tracks to match your investigation mood!
        </p>
      </div>
    </div>
  );
};

export default SoundSettings;
