import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, X, Lightbulb, Lock } from '../icon';

const WordCipher = ({ onComplete }) => {
  const [cipher, setCipher] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [completed, setCompleted] = useState(false);
  const completedRef = useRef(false);

  const ciphers = [
    {
      encoded: "UIJT JT FWJEFODF",
      decoded: "THIS IS EVIDENCE",
      shift: 1,
      hint: "Each letter is shifted forward by 1 in the alphabet (Caesar Cipher)"
    },
    {
      encoded: "LQYHVWLJDWH",
      decoded: "INVESTIGATE",
      shift: 3,
      hint: "Classic Caesar Cipher with shift of 3"
    },
    {
      encoded: "XQORFN WKH FOXH",
      decoded: "UNLOCK THE CLUE",
      shift: 3,
      hint: "Caesar shift - think Julius Caesar"
    }
  ];

  useEffect(() => {
    const randomCipher = ciphers[Math.floor(Math.random() * ciphers.length)];
    setCipher(randomCipher);
    // Play game start sound
    try {
      window.SoundService?.playSound('gameStart');
    } catch (e) {
      console.warn('Sound failed:', e);
    }
  }, []);

  if (!cipher) return null;

  const checkAnswer = () => {
    if (completedRef.current) return;

    const normalized = userInput.toUpperCase().trim();

    if (normalized === cipher.decoded) {
      completedRef.current = true;
      setCompleted(true);
      // Play success sound
      try {
        window.SoundService?.playSound('gameSuccess');
      } catch (e) {
        console.warn('Sound failed:', e);
      }
      onComplete({ success: true, attempts: attempts + 1 });
    } else {
      setAttempts(attempts + 1);
      setUserInput('');
      // Play fail sound
      try {
        window.SoundService?.playSound('gameFail');
      } catch (e) {
        console.warn('Sound failed:', e);
      }
      alert('Incorrect decryption. Try again!');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && userInput.trim() && !completed) {
      checkAnswer();
    }
  };

  return (
    <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">🔐 Word Cipher</h3>
        <p className="text-stone-400 text-sm">Decrypt the secret message</p>
        {attempts > 0 && <p className="text-amber-400 text-xs mt-1">Attempts: {attempts}</p>}
      </div>

      {/* Encrypted Message */}
      <div className="bg-stone-800/60 border-2 border-amber-600/50 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-5 h-5 text-amber-500" />
          <p className="text-amber-400 font-semibold text-sm">ENCRYPTED MESSAGE:</p>
        </div>
        <p className="text-center text-2xl font-mono text-white tracking-wider">
          {cipher.encoded}
        </p>
      </div>

      {/* Alphabet Reference */}
      <div className="bg-stone-800/40 border border-stone-700/50 rounded-lg p-4 mb-6">
        <p className="text-stone-400 text-xs mb-2 text-center">Alphabet Reference:</p>
        <p className="text-center font-mono text-stone-300 text-sm">
          A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
        </p>
      </div>

      {/* Input */}
      <div className="mb-6">
        <label className="block text-stone-300 font-medium mb-2 text-sm">Your Decryption:</label>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          placeholder="Enter decrypted message..."
          disabled={completed}
          className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Hint */}
      {showHint && (
        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-blue-200 text-sm">{cipher.hint}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!showHint && (
          <button
            onClick={() => setShowHint(true)}
            className="flex-1 bg-stone-700 hover:bg-stone-600 text-white font-medium py-3 px-6 rounded-lg transition-all"
          >
            💡 Hint
          </button>
        )}
        <button
          onClick={checkAnswer}
          disabled={!userInput.trim() || completed}
          className="flex-1 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 disabled:from-stone-700 disabled:to-stone-800 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:cursor-not-allowed"
        >
          Decrypt
        </button>
      </div>
    </div>
  );
};

export default WordCipher;
