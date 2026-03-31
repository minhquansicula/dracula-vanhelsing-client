import React from "react";
import Card from "./Card";

const smoothTransition =
  "transition-[transform,opacity,filter,box-shadow] duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu";

const DeckAndDiscard = ({
  drawPileCount,
  topDiscardCard,
  onDraw,
  onDiscard,
  isMyTurn,
  hasDrawnCard,
}) => {
  const canDraw = isMyTurn && !hasDrawnCard && drawPileCount > 0;

  return (
    <div
      className={`flex flex-col gap-6 items-center justify-center p-6 bg-[#0d1316]/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.8)] select-none w-full ${smoothTransition} hover:border-white/10`}
    >
      {/* DRAW PILE */}
      <div
        className={`flex flex-col items-center gap-3 w-full ${canDraw ? "cursor-pointer group" : "opacity-50 cursor-not-allowed"}`}
        onClick={() => canDraw && onDraw()}
      >
        <div className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold">
          Bộ Bài <span className="text-white/80">({drawPileCount})</span>
        </div>

        <div
          className={`w-20 xl:w-28 aspect-[2/3] relative transition-transform duration-300 ${canDraw ? "group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]" : ""}`}
        >
          {drawPileCount > 0 ? (
            <>
              {drawPileCount > 2 && (
                <div className="absolute inset-0 bg-[#0a0f12] border border-white/10 rounded-sm translate-y-2 translate-x-2" />
              )}
              {drawPileCount > 1 && (
                <div className="absolute inset-0 bg-[#0d1316] border border-white/10 rounded-sm translate-y-1 translate-x-1" />
              )}
              <div
                className={`absolute inset-0 shadow-lg border ${canDraw ? "border-game-dracula-orange animate-pulse" : "border-white/5"}`}
              >
                <Card isHidden className="w-full h-full" />
              </div>
            </>
          ) : (
            <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-sm flex items-center justify-center text-white/20 text-[10px] uppercase tracking-widest text-center p-2 bg-black/20">
              Hết Bài
            </div>
          )}
        </div>
      </div>

      <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* DISCARD PILE */}
      <div
        className="flex flex-col items-center gap-3 w-full"
        onClick={onDiscard}
      >
        <div className="text-[10px] text-game-dracula-orange/70 uppercase tracking-[0.2em] font-bold">
          Mộ Bài
        </div>

        <div className="w-20 xl:w-28 aspect-[2/3] relative transition-transform duration-300">
          {topDiscardCard ? (
            <div className="absolute inset-0 shadow-lg border border-game-dracula-orange/20">
              <Card cardData={topDiscardCard} className="w-full h-full" />
            </div>
          ) : (
            <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-sm flex items-center justify-center text-white/20 text-[10px] uppercase tracking-widest text-center p-2 bg-black/20">
              Trống
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeckAndDiscard;
