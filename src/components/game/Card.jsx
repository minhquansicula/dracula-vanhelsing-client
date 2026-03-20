import React from "react";

const THEME_MAP = {
  0: {
    name: "Blood",
    bg: "bg-gradient-to-br from-[#5a1010] to-[#2d0000]",
    border: "border-[#b91c1c]",
    innerBorder: "border-[#ff6b6b]/30",
    text: "text-[#fca5a5]",
    glow: "shadow-[0_0_15px_rgba(185,28,28,0.6)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
  },
  1: {
    name: "Coffin",
    bg: "bg-gradient-to-br from-[#3b1c54] to-[#1a082b]",
    border: "border-[#7e22ce]",
    innerBorder: "border-[#c084fc]/30",
    text: "text-[#d8b4fe]",
    glow: "shadow-[0_0_15px_rgba(126,34,206,0.6)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M8 2h8l4 6v14H4V8l-4-6z" />
      </svg>
    ),
  },
  2: {
    name: "Candle",
    bg: "bg-gradient-to-br from-[#0f3d2b] to-[#041a10]",
    border: "border-[#059669]",
    innerBorder: "border-[#34d399]/30",
    text: "text-[#6ee7b7]",
    glow: "shadow-[0_0_15px_rgba(5,150,105,0.6)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M9 21h6v-8H9v8zm2-10h2V7h-2v4zm-1-6c0-1.1.9-2 2-2s2 .9 2 2-1.99 4-2 4-2-2.89-2-4z" />
      </svg>
    ),
  },
  3: {
    name: "Cross",
    bg: "bg-gradient-to-br from-[#5e470c] to-[#2e2100]",
    border: "border-[#d97706]",
    innerBorder: "border-[#fbbf24]/30",
    text: "text-[#fde68a]",
    glow: "shadow-[0_0_15px_rgba(217,119,6,0.6)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M10.5 2h3v6h5v3h-5v11h-3V11h-5V8h5z" />
      </svg>
    ),
  },
};

const Card = ({
  cardData,
  isHidden = false,
  onClick,
  className = "",
  isOpponent = false,
}) => {
  if (isHidden) {
    return (
      <div
        className={`w-full aspect-[2/3] rounded-lg bg-gradient-to-br from-[#1a0505] to-[#000000] border-2 border-[#3a0a0a] flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.9)] relative overflow-hidden transition-transform duration-300 ${className}`}
      >
        <div className="absolute inset-1.5 border border-[#4a1010] rounded-md flex items-center justify-center bg-black/40">
          <div className="w-full h-full bg-[radial-gradient(circle,_rgba(154,27,31,0.2)_0%,_transparent_70%)]" />

          <div className="absolute flex flex-col items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-12 h-16 sm:w-16 sm:h-24 text-[#8b1010] drop-shadow-[0_0_12px_rgba(220,38,38,0.7)]"
            >
              <path
                d="M11 2v5H6v4h5v11h4V11h5V7h-5V2h-4z"
                stroke="#ff4d4d"
                strokeWidth="0.5"
              />
            </svg>
          </div>

          <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#4a1010] to-transparent" />
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#4a1010] to-transparent" />
        </div>
      </div>
    );
  }

  const theme = THEME_MAP[cardData?.color] || THEME_MAP[0];

  return (
    <div
      onClick={onClick}
      className={`w-full aspect-[2/3] rounded-lg ${theme.bg} border-2 ${theme.border} shadow-[0_8px_20px_rgba(0,0,0,0.8)] flex flex-col justify-between p-2 relative cursor-pointer hover:-translate-y-4 hover:${theme.glow} transition-all duration-300 group ${className}`}
    >
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] pointer-events-none mix-blend-overlay rounded-lg" />

      <div
        className={`absolute inset-1.5 border ${theme.innerBorder} rounded-md pointer-events-none`}
      />

      <div
        className={`text-xl sm:text-3xl font-black ${theme.text} leading-none font-['Playfair_Display'] z-10 flex flex-col items-center w-fit ml-1 mt-1 drop-shadow-md`}
      >
        <span>{cardData?.value}</span>
        <div className="w-4 h-4 sm:w-5 sm:h-5 mt-1 opacity-80">
          {theme.icon}
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none overflow-hidden">
        <div
          className={`w-16 h-16 sm:w-24 sm:h-24 opacity-10 ${theme.text} transform group-hover:scale-125 transition-transform duration-700`}
        >
          {theme.icon}
        </div>
        <span
          className={`absolute text-7xl sm:text-9xl font-black font-['Playfair_Display'] opacity-[0.07] ${theme.text} transform group-hover:scale-110 transition-transform duration-500`}
        >
          {cardData?.value}
        </span>
      </div>

      <div
        className={`text-xl sm:text-3xl font-black ${theme.text} leading-none rotate-180 font-['Playfair_Display'] z-10 flex flex-col items-center w-fit ml-1 mt-1 drop-shadow-md self-end mr-1 mb-1`}
      >
        <span>{cardData?.value}</span>
        <div className="w-4 h-4 sm:w-5 sm:h-5 mt-1 opacity-80">
          {theme.icon}
        </div>
      </div>
    </div>
  );
};

export default Card;
