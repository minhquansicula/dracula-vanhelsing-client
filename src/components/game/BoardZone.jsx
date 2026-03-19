import React from "react";

const BoardZone = ({ zone }) => {
  return (
    <div className="w-full aspect-[3/4] bg-black/40 border border-white/10 rounded-sm p-3 flex flex-col justify-between relative overflow-hidden group hover:border-white/30 transition-colors">
      {/* Background mờ ảo */}
      <div className="absolute inset-0 bg-gradient-to-b from-game-vanhelsing-blood/5 via-transparent to-game-dracula-orange/5" />

      {/* Số thứ tự Zone chìm ở Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-8xl font-black text-white/[0.03] font-['Playfair_Display']">
          {zone.zoneIndex}
        </span>
      </div>

      {/* Nửa trên: Human Tokens (Van Helsing) */}
      <div className="flex flex-wrap justify-center gap-1.5 z-10 h-[45%] content-start">
        {Array.from({ length: zone.humanTokens }).map((_, i) => (
          <div
            key={`human-${i}`}
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-300 border-2 border-white shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.5)]"
            title="Nhân loại"
          />
        ))}
      </div>

      {/* Vạch chia ranh giới sinh tử */}
      <div className="absolute top-1/2 left-4 right-4 h-px bg-white/10"></div>

      {/* Nửa dưới: Vampire Tokens (Dracula) */}
      <div className="flex flex-wrap justify-center gap-1.5 z-10 h-[45%] content-end">
        {Array.from({ length: zone.vampireTokens }).map((_, i) => (
          <div
            key={`vampire-${i}`}
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-600 border-2 border-red-300 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),_0_0_10px_rgba(220,38,38,0.8)]"
            title="Ma cà rồng"
          />
        ))}
      </div>
    </div>
  );
};

export default BoardZone;
