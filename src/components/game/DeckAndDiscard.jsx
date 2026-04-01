import React from "react";
import Card from "./Card";
// 1. Import Framer Motion
import { motion, AnimatePresence } from "framer-motion";

const DeckAndDiscard = ({
  drawPileCount,
  topDiscardCard,
  onDraw,
  isMyTurn,
  hasDrawnCard,
}) => {
  const canDraw = isMyTurn && !hasDrawnCard;

  return (
    <div className="flex flex-col items-center gap-8 xl:gap-12 bg-[#0d1316]/80 backdrop-blur-md py-8 px-4 xl:py-10 xl:px-6 rounded-full border border-white/5 shadow-[10px_0_40px_rgba(0,0,0,0.9)]">
      {/* KHU VỰC BỘ BÀI (DECK) */}
      <div className="flex flex-col items-center gap-3">
        <div className="text-white/40 text-[10px] xl:text-xs uppercase font-bold tracking-widest">
          Bộ Bài ({drawPileCount})
        </div>
        <div className="relative group perspective-1000">
          <div
            className={`w-24 xl:w-32 aspect-[2/3] rounded-lg transition-all duration-400 ease-out transform-gpu
              ${
                canDraw
                  ? "cursor-pointer hover:-translate-y-4 hover:scale-105 shadow-[0_0_30px_rgba(225,85,37,0.5)] border border-game-dracula-orange animate-pulse"
                  : "opacity-80 border border-white/10 shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              }
            `}
            onClick={canDraw ? onDraw : undefined}
          >
            {drawPileCount > 0 ? (
              <Card isHidden={true} className="w-full h-full" />
            ) : (
              <div className="w-full h-full bg-black/40 flex items-center justify-center rounded-lg">
                <span className="text-white/20 text-xs uppercase font-bold">
                  Hết bài
                </span>
              </div>
            )}
          </div>

          {canDraw && (
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-game-dracula-orange text-black px-3 py-1 text-[10px] font-bold uppercase rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              Click để rút bài
            </div>
          )}
        </div>
      </div>

      <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      {/* KHU VỰC MỘ BÀI (DISCARD PILE) */}
      <div className="flex flex-col items-center gap-3">
        <div className="text-white/40 text-[10px] xl:text-xs uppercase font-bold tracking-widest">
          Mộ Bài
        </div>
        <div className="w-24 xl:w-32 aspect-[2/3] rounded-lg border border-white/5 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] bg-black/50 relative flex items-center justify-center transition-all duration-300 overflow-visible perspective-1000">
          {/* 2. Bọc AnimatePresence để quản lý vòng đời component */}
          <AnimatePresence mode="wait">
            {topDiscardCard ? (
              // 3. Sử dụng motion.div với Spring Physics
              <motion.div
                key={`discard-${topDiscardCard.cardId}`}
                // Trạng thái bắt đầu: Nằm tít bên phải (tay người chơi), xoay 180 độ, to hơn bình thường
                initial={{
                  x: 600,
                  y: 200,
                  rotateY: 180,
                  rotateZ: 45,
                  scale: 1.5,
                  opacity: 0,
                }}
                // Trạng thái đích: Nằm gọn gàng trong mộ bài
                animate={{
                  x: 0,
                  y: 0,
                  rotateY: 0,
                  rotateZ: 0,
                  scale: 1,
                  opacity: 1,
                }}
                // Setup vật lý lò xo: stiffness (độ cứng lò xo), damping (lực cản không khí)
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  mass: 0.8,
                }}
                className="absolute inset-0 w-full h-full z-50 drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] origin-center"
              >
                <Card cardData={topDiscardCard} className="w-full h-full" />
              </motion.div>
            ) : (
              <span className="text-white/10 text-[10px] uppercase font-bold tracking-widest">
                Trống
              </span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DeckAndDiscard;
