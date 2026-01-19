// Sound Service for MindCase App
// Manages background music and sound effects

class SoundServiceClass {
  constructor() {
    this.bgMusic = null;
    this.soundEffects = {};
    this.settings = this.loadSettings();
    this.isInitialized = false;
  }

  loadSettings() {
    const saved = localStorage.getItem('sound_settings');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      bgMusicEnabled: true,
      bgMusicVolume: 0.3,
      sfxEnabled: true,
      sfxVolume: 0.5,
      selectedBgMusic: 'detective'
    };
  }

  saveSettings() {
    localStorage.setItem('sound_settings', JSON.stringify(this.settings));
  }

  // Initialize audio context (must be called after user interaction)
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Create background music tracks from MP3 files
      this.bgMusic = {
        detective: this.createAudioElement('bgmusic/Ocean Bloom - Mystery (freetouse.com).mp3'),
        morning: this.createAudioElement('bgmusic/Morning-Routine-Lofi-Study-Music(chosic.com).mp3'),
        thinking: this.createAudioElement('bgmusic/Lukrembo - Dreaming After Work (freetouse.com).mp3'),
        mission: this.createAudioElement('bgmusic/Epic Spectrum - Mission (freetouse.com).mp3'),
        calm: this.createAudioElement('bgmusic/Colorful-Flowers(chosic.com).mp3'),
        chill: this.createAudioElement('bgmusic/massobeats - honey jam (freetouse.com).mp3'),
        mud: this.createAudioElement('bgmusic/Dagored - Mud (freetouse.com).mp3')
      };

      // Create sound effects using Web Audio API
      this.createSoundEffects();

      this.isInitialized = true;

      // Start background music if enabled
      if (this.settings.bgMusicEnabled) {
        this.playBackgroundMusic();
      }
    } catch (error) {
      console.warn('Sound initialization failed:', error);
    }
  }

  // Create audio element for MP3 playback
  createAudioElement(src) {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = this.settings.bgMusicVolume;
    audio.preload = 'auto';
    return audio;
  }


  createSoundEffects() {
    // All sound effects use Web Audio API for synthesis
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    this.soundEffects = {
      // Button click - short crisp sound
      buttonClick: () => this.playSynth(ctx, [
        { freq: 800, type: 'square', duration: 0.05 }
      ], 0.3),

      // Case file opening - paper rustle
      caseOpen: () => this.playSynth(ctx, [
        { freq: 300, type: 'noise', duration: 0.3 },
        { freq: 500, type: 'noise', duration: 0.2 }
      ], 0.4),

      // Topic selection - confirmation
      topicSelect: () => this.playSynth(ctx, [
        { freq: 600, type: 'sine', duration: 0.1 },
        { freq: 800, type: 'sine', duration: 0.1 }
      ], 0.35),

      // Evidence unlock - success chime
      evidenceUnlock: () => this.playSynth(ctx, [
        { freq: 523.25, type: 'sine', duration: 0.15 }, // C5
        { freq: 659.25, type: 'sine', duration: 0.15 }, // E5
        { freq: 783.99, type: 'sine', duration: 0.2 }   // G5
      ], 0.4),

      // Puzzle complete - success
      puzzleComplete: () => this.playSynth(ctx, [
        { freq: 523.25, type: 'sine', duration: 0.1 },
        { freq: 659.25, type: 'sine', duration: 0.1 },
        { freq: 783.99, type: 'sine', duration: 0.1 },
        { freq: 1046.5, type: 'sine', duration: 0.2 }
      ], 0.45),

      // Minigame start
      gameStart: () => this.playSynth(ctx, [
        { freq: 440, type: 'square', duration: 0.1 },
        { freq: 554.37, type: 'square', duration: 0.15 }
      ], 0.35),

      // Minigame success
      gameSuccess: () => this.playSynth(ctx, [
        { freq: 659.25, type: 'sine', duration: 0.08 },
        { freq: 783.99, type: 'sine', duration: 0.08 },
        { freq: 1046.5, type: 'sine', duration: 0.12 }
      ], 0.4),

      // Minigame fail
      gameFail: () => this.playSynth(ctx, [
        { freq: 200, type: 'sawtooth', duration: 0.3 }
      ], 0.3),

      // Navigation
      navClick: () => this.playSynth(ctx, [
        { freq: 700, type: 'sine', duration: 0.06 }
      ], 0.25),

      // Modal open
      modalOpen: () => this.playSynth(ctx, [
        { freq: 400, type: 'sine', duration: 0.1 },
        { freq: 600, type: 'sine', duration: 0.1 }
      ], 0.3),

      // Modal close
      modalClose: () => this.playSynth(ctx, [
        { freq: 600, type: 'sine', duration: 0.08 },
        { freq: 400, type: 'sine', duration: 0.08 }
      ], 0.25),

      // Typing/analyzing
      typing: () => this.playSynth(ctx, [
        { freq: 1200, type: 'square', duration: 0.03 }
      ], 0.15)
    };
  }

  playSynth(audioContext, notes, volume) {
    if (!this.settings.sfxEnabled) return;

    const now = audioContext.currentTime;
    let timeOffset = 0;

    notes.forEach(note => {
      const osc = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      if (note.type === 'noise') {
        // Create noise using buffer
        const bufferSize = audioContext.sampleRate * note.duration;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = audioContext.createBufferSource();
        noise.buffer = buffer;

        const filter = audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = note.freq;

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        gainNode.gain.setValueAtTime(volume * this.settings.sfxVolume, now + timeOffset);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + timeOffset + note.duration);

        noise.start(now + timeOffset);
        noise.stop(now + timeOffset + note.duration);
      } else {
        osc.type = note.type;
        osc.frequency.value = note.freq;

        osc.connect(gainNode);
        gainNode.connect(audioContext.destination);

        gainNode.gain.setValueAtTime(volume * this.settings.sfxVolume, now + timeOffset);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + timeOffset + note.duration);

        osc.start(now + timeOffset);
        osc.stop(now + timeOffset + note.duration);
      }

      timeOffset += note.duration;
    });
  }

  playBackgroundMusic() {
    if (!this.isInitialized || !this.settings.bgMusicEnabled) return;

    const musicType = this.settings.selectedBgMusic;
    const audio = this.bgMusic[musicType];

    if (!audio) return;

    // Stop all other music
    Object.keys(this.bgMusic).forEach(key => {
      if (key !== musicType) {
        this.stopMusic(key);
      }
    });

    // Start selected music
    audio.volume = this.settings.bgMusicVolume;
    audio.play().catch(e => {
      console.warn('Audio play failed:', e);
    });
  }

  stopMusic(type) {
    const audio = this.bgMusic[type];
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  }

  stopAllMusic() {
    Object.keys(this.bgMusic).forEach(key => {
      this.stopMusic(key);
    });
  }

  // Public methods
  play(soundName) {
    if (!this.isInitialized) {
      this.initialize();
    }

    if (this.soundEffects[soundName]) {
      this.soundEffects[soundName]();
    }
  }

  setBgMusicEnabled(enabled) {
    this.settings.bgMusicEnabled = enabled;
    this.saveSettings();

    if (enabled) {
      this.playBackgroundMusic();
    } else {
      this.stopAllMusic();
    }
  }

  setSfxEnabled(enabled) {
    this.settings.sfxEnabled = enabled;
    this.saveSettings();
  }

  setBgMusicVolume(volume) {
    this.settings.bgMusicVolume = volume;
    this.saveSettings();

    const musicType = this.settings.selectedBgMusic;
    if (this.bgMusic[musicType]) {
      this.bgMusic[musicType].volume = volume;
    }
  }

  setSfxVolume(volume) {
    this.settings.sfxVolume = volume;
    this.saveSettings();
  }

  setSelectedBgMusic(musicType) {
    this.settings.selectedBgMusic = musicType;
    this.saveSettings();

    if (this.settings.bgMusicEnabled) {
      this.stopAllMusic();
      this.playBackgroundMusic();
    }
  }

  getSettings() {
    return { ...this.settings };
  }
}

// Create singleton instance - make it global for module cleaning compatibility
const SoundService = new SoundServiceClass();

export { SoundService };
