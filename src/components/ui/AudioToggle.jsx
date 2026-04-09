// src/components/ui/AudioToggle.jsx
import React, { useState } from "react";
import { audioManager } from "../../utils/AudioManager";

const AudioToggle = () => {
  const [isMuted, setIsMuted] = useState(audioManager.isMuted);

  const handleToggleSound = () => {
    const mutedState = audioManager.toggleMute();
    setIsMuted(mutedState);
  };

  return (
    <button
      onClick={handleToggleSound}
      className="fixed bottom-6 left-6 z-[100] w-12 h-12 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-game-dracula-orange hover:scale-110 transition-all duration-300 shadow-lg outline-none"
      title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
    >
      {isMuted ? (
        // Icon Loa gạch chéo
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
          />
        </svg>
      ) : (
        // Icon Loa đang phát
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      )}
    </button>
  );
};

export default AudioToggle;
