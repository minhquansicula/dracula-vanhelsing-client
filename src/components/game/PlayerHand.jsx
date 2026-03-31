// src/components/game/PlayerHand.jsx
import React from "react";
import Card from "./Card";
import PlayerStatusWidget from "./PlayerStatusWidget";

const smoothTransition =
  "transition-[transform,opacity,filter,box-shadow] duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu";

const PlayerHand = ({
  player,
  type,
  hoveredDistrict,
  setHoveredDistrict,
  isMyTurn,
  hasDrawnCard,
  drawnCard,
  onPlayCard,
}) => {
  const isSelf = type === "self";
  const groupClass = isSelf ? "group/player" : "group/opponent";

  return (
    <div
      className={`relative w-full flex justify-between items-center ${groupClass}`}
    >
      {/* Widget trạng thái người chơi */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 right-[100%] mr-8 xl:mr-12 z-20 ${smoothTransition}`}
      >
        <PlayerStatusWidget player={player} type={type} />
      </div>

      {/* 5 lá bài chính trên tay */}
      <div className="flex w-full justify-between items-center gap-2 xl:gap-3">
        {player.hand.map((card, i) => {
          const districtId = i + 1;
          const isHovered = hoveredDistrict === districtId;
          const isOthersHovered =
            hoveredDistrict !== null && hoveredDistrict !== districtId;

          const canSwap = isSelf && isMyTurn && hasDrawnCard;

          const hoverEffects = isSelf
            ? isHovered
              ? "scale-110 -translate-y-8 z-30 drop-shadow-[0_0_35px_rgba(225,85,37,0.6)]" // Hover bài cao hơn 1 xíu
              : "z-0 drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]"
            : isHovered
              ? "scale-110 translate-y-4 z-20 drop-shadow-[0_15px_30px_rgba(0,0,0,1)]"
              : "z-0 drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)]";

          const originClass = isSelf ? "origin-bottom" : "origin-top";
          const cursorClass = canSwap ? "cursor-pointer" : "cursor-default";

          return (
            <div
              key={i}
              // CẬP NHẬT KÍCH THƯỚC: w-28 xl:w-40 (Cân bằng, không bị che Map)
              className={`w-28 xl:w-40 aspect-[2/3] shrink-0 ${originClass} ${cursorClass} ${smoothTransition}
                ${isOthersHovered ? `opacity-${isSelf ? "40" : "30"} blur-[${isSelf ? "1px" : "2px"}] scale-95` : "opacity-100"} 
                ${hoverEffects} 
                ${canSwap && !isHovered ? "animate-pulse ring-2 ring-game-dracula-orange/30 rounded-md" : ""}
              `}
              onMouseEnter={() => setHoveredDistrict(districtId)}
              onMouseLeave={() => setHoveredDistrict(null)}
              onClick={() => canSwap && onPlayCard(card.cardId)}
            >
              <Card
                cardData={card}
                isHidden={!isSelf && !card.isRevealed}
                className={`w-full h-full ${!isSelf ? "rotate-180" : ""}`}
              />
            </div>
          );
        })}
      </div>

      {/* Vị trí lá bài thứ 6 (Lá bài vừa rút) */}
      {isSelf && (
        <div className="absolute top-1/2 -translate-y-1/2 left-[100%] ml-8 xl:ml-12 z-20 flex items-center pr-4">
          <div className="relative group/drawn flex-col flex items-center">
            {/* Tiêu đề slot */}
            <div
              className={`absolute -top-7 whitespace-nowrap text-[9px] xl:text-[11px] uppercase font-bold tracking-widest transition-colors duration-300 ${hasDrawnCard ? "text-game-dracula-orange drop-shadow-[0_0_8px_rgba(225,85,37,0.8)]" : "text-white/30"}`}
            >
              {hasDrawnCard ? "Lá Bài Rút" : "Slot Trống"}
            </div>

            <div
              // CẬP NHẬT KÍCH THƯỚC: w-28 xl:w-40 cho đồng bộ
              className={`w-28 xl:w-40 aspect-[2/3] shrink-0 origin-bottom rounded-md transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu
                ${
                  hasDrawnCard
                    ? "cursor-pointer border border-game-dracula-orange shadow-[0_10px_30px_rgba(225,85,37,0.3)] hover:-translate-y-8 hover:scale-110 hover:shadow-[0_15px_40px_rgba(225,85,37,0.6)] z-30"
                    : "border-2 border-dashed border-white/10 opacity-40 flex items-center justify-center bg-black/10"
                }
              `}
              onClick={() => hasDrawnCard && onPlayCard(drawnCard.cardId)}
            >
              {hasDrawnCard && drawnCard ? (
                <Card cardData={drawnCard} className="w-full h-full" />
              ) : (
                <div className="text-white/20">
                  <svg
                    className="w-8 h-8 opacity-40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              )}
            </div>

            {hasDrawnCard && (
              <div className="absolute -bottom-8 whitespace-nowrap text-[10px] bg-game-vanhelsing-blood text-white px-4 py-1.5 font-bold uppercase tracking-widest opacity-0 group-hover/drawn:opacity-100 transition-opacity duration-300 pointer-events-none rounded-md z-40 shadow-lg">
                Vứt lá này
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerHand;
