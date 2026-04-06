// src/components/game/PlayerHand.jsx
import React from "react";
import Card from "./Card";
import PlayerStatusWidget from "./PlayerStatusWidget";
import { motion, AnimatePresence } from "framer-motion";

const smoothTransition =
  "transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu";

const PlayerHand = ({
  player,
  type,
  hoveredDistrict,
  setHoveredDistrict,
  isMyTurn,
  hasDrawnCard,
  drawnCard,
  onPlayCard,
  isTargeting = false,
  onTargetClick = () => {},
  selectedCards = [], // Nhận danh sách các lá bài đang được chọn (Dành cho Kỹ năng 4)
}) => {
  const isSelf = type === "self";
  const groupClass = isSelf ? "group/player" : "group/opponent";

  return (
    <div
      className={`relative w-full flex justify-between items-center ${groupClass}`}
    >
      <div
        className={`absolute top-1/2 -translate-y-1/2 right-[100%] mr-8 xl:mr-12 z-20 ${smoothTransition}`}
      >
        <PlayerStatusWidget player={player} type={type} />
      </div>

      <div className="flex w-full justify-between items-center gap-2 xl:gap-3">
        {player.hand.map((card, i) => {
          const districtId = i + 1;
          const isDistrictHoveredFromMap = hoveredDistrict === districtId;
          const isOthersHoveredFromMap =
            hoveredDistrict !== null && hoveredDistrict !== districtId;

          // Rút bài/Đánh bài thông thường chỉ có hiệu lực khi KHÔNG phải trong chế độ Target
          const canSwapNormally =
            isSelf && isMyTurn && hasDrawnCard && !isTargeting;
          const isTargetable = isTargeting;
          const isSelected = selectedCards.includes(card.cardId);

          const visualEffects = isDistrictHoveredFromMap
            ? isSelf
              ? "scale-105 -translate-y-4 z-30 drop-shadow-[0_0_25px_rgba(225,85,37,0.5)] ring-2 ring-game-dracula-orange/50 rounded-md"
              : "scale-105 translate-y-3 z-20 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] ring-2 ring-white/30 rounded-md"
            : isSelf
              ? "z-0 drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] hover:scale-[1.03] hover:-translate-y-1 hover:brightness-110 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:z-30"
              : "z-0 drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)] hover:scale-[1.03] hover:translate-y-1 hover:brightness-110 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:z-20";

          const originClass = isSelf ? "origin-bottom" : "origin-top";
          const cursorClass =
            canSwapNormally || isTargetable
              ? "cursor-pointer"
              : "cursor-default";

          return (
            <div
              key={i}
              className={`w-28 xl:w-40 aspect-[2/3] shrink-0 ${originClass} ${cursorClass} ${smoothTransition}
                ${isOthersHoveredFromMap ? `opacity-${isSelf ? "50" : "40"} blur-[1px] scale-[0.98]` : "opacity-100"} 
                ${visualEffects} 
                ${canSwapNormally && !isDistrictHoveredFromMap ? "animate-pulse ring-2 ring-game-dracula-orange/30 rounded-md" : ""}
                ${isTargetable && !isSelected ? `ring-2 ${isSelf ? "ring-game-dracula-orange" : "ring-game-vanhelsing-blood"} shadow-[0_0_20px_rgba(154,27,31,0.8)] animate-pulse rounded-md hover:scale-105` : ""}
                ${isSelected ? "ring-4 ring-game-dracula-orange shadow-[0_0_30px_rgba(225,85,37,1)] scale-105 z-30 brightness-110 rounded-md" : ""}
              `}
              onClick={() => {
                if (isTargetable) {
                  onTargetClick(card.cardId);
                } else if (canSwapNormally) {
                  onPlayCard(card.cardId);
                }
              }}
            >
              <Card
                cardData={card}
                isHidden={!isSelf && !card.isRevealed}
                className={`w-full h-full ${!isSelf ? "rotate-180" : ""}`}
              />

              {isTargetable && !isSelected && (
                <div
                  className={`absolute inset-0 hover:bg-black/30 rounded-md z-30 flex items-center justify-center pointer-events-none transition-colors duration-300 opacity-0 hover:opacity-100 ${!isSelf ? "rotate-180" : ""}`}
                >
                  <span
                    className={`text-white text-xs font-bold uppercase tracking-widest drop-shadow-md bg-black/60 px-2 py-1 rounded border ${isSelf ? "border-game-dracula-orange text-game-dracula-orange" : "border-game-vanhelsing-blood"}`}
                  >
                    Chọn
                  </span>
                </div>
              )}

              {isSelected && (
                <div
                  className={`absolute inset-0 bg-game-dracula-orange/20 rounded-md z-30 flex items-center justify-center pointer-events-none ${!isSelf ? "rotate-180" : ""}`}
                >
                  <span className="text-white text-xs font-black drop-shadow-md bg-black/60 px-2 py-1 rounded border border-game-dracula-orange">
                    Đã Chọn
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isSelf && (
        <div className="absolute top-1/2 -translate-y-1/2 left-[100%] ml-8 xl:ml-12 z-20 flex flex-col items-center pr-4">
          <div
            className={`absolute -top-6 whitespace-nowrap text-[9px] xl:text-[11px] uppercase font-bold tracking-widest transition-colors duration-300 ${hasDrawnCard ? "text-game-dracula-orange drop-shadow-[0_0_8px_rgba(225,85,37,0.8)]" : "text-white/30"}`}
          >
            {hasDrawnCard ? "Lá Bài Rút" : "Slot Trống"}
          </div>

          <div
            className={`w-28 xl:w-40 aspect-[2/3] shrink-0 origin-bottom rounded-md transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu perspective-1000
               ${
                 hasDrawnCard && !isTargeting
                   ? "cursor-pointer border border-game-dracula-orange shadow-[0_10px_30px_rgba(225,85,37,0.3)] hover:-translate-y-8 hover:scale-110 hover:shadow-[0_15px_40px_rgba(225,85,37,0.6)] z-30"
                   : "border-2 border-dashed border-white/10 opacity-40 flex items-center justify-center bg-black/10"
               }
               ${hasDrawnCard && isTargeting ? "grayscale opacity-50 pointer-events-none" : ""}
             `}
            onClick={() =>
              hasDrawnCard && !isTargeting && onPlayCard(drawnCard.cardId)
            }
          >
            <AnimatePresence mode="wait">
              {hasDrawnCard && drawnCard ? (
                <motion.div
                  key={`drawn-${drawnCard.cardId}`}
                  initial={{
                    x: -600,
                    y: -200,
                    rotateY: -180,
                    rotateZ: -45,
                    scale: 0.5,
                    opacity: 0,
                  }}
                  animate={{
                    x: 0,
                    y: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    scale: 1,
                    opacity: 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 22,
                    mass: 1,
                  }}
                  className="w-full h-full origin-center"
                >
                  <Card cardData={drawnCard} className="w-full h-full" />
                </motion.div>
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
            </AnimatePresence>
          </div>

          {hasDrawnCard && !isTargeting && (
            <div className="absolute -bottom-8 whitespace-nowrap text-[10px] bg-game-vanhelsing-blood text-white px-4 py-1.5 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-md z-40 shadow-lg">
              Vứt lá này
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerHand;
