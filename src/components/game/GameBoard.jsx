import React, { useState } from "react";
import Card from "./Card";

import boardBg from "../../assets/images/board-bg.png";
import bloodToken from "../../assets/images/blood.svg";
import coffinToken from "../../assets/images/coffin.svg";
import candleToken from "../../assets/images/candle.svg";
import crossToken from "../../assets/images/cross.svg";

import { districts } from "../../components/game/bonus/mapConfig";

const GameBoard = () => {
  const mockGameState = {
    roundNumber: 1,
    colorRanking: [0, 1, 2, 3],
    zones: [
      { zoneIndex: 1, humanTokens: 4, vampireTokens: 0 },
      { zoneIndex: 2, humanTokens: 3, vampireTokens: 1 },
      { zoneIndex: 3, humanTokens: 4, vampireTokens: 0 },
      { zoneIndex: 4, humanTokens: 2, vampireTokens: 2 },
      { zoneIndex: 5, humanTokens: 4, vampireTokens: 0 },
    ],
    players: [
      {
        userId: "user-1",
        username: "Lãnh Chúa",
        faction: 0,
        health: 12,
        hand: [
          { cardId: 1, color: 0, value: 5, isRevealed: false },
          { cardId: 2, color: 1, value: 2, isRevealed: false },
          { cardId: 3, color: 2, value: 8, isRevealed: false },
          { cardId: 4, color: 3, value: 1, isRevealed: false },
          { cardId: 5, color: 0, value: 7, isRevealed: false },
        ],
      },
      {
        userId: "user-2",
        username: "Giáo Sư",
        faction: 1,
        health: 12,
        hand: [
          { cardId: 6, isRevealed: false },
          { cardId: 7, isRevealed: false },
          { cardId: 8, isRevealed: false },
          { cardId: 9, isRevealed: false },
          { cardId: 10, isRevealed: false },
        ],
      },
    ],
  };

  const myPlayer = mockGameState.players[0];
  const opponent = mockGameState.players[1];

  const [ranking, setRanking] = useState(mockGameState.colorRanking);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  // ================= DRAG RANKING =================
  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e, targetIndex) => {
    if (draggedItemIndex === null) return;

    if (draggedItemIndex !== targetIndex) {
      setRanking((prev) => {
        const arr = [...prev];
        const item = arr[draggedItemIndex];
        arr.splice(draggedItemIndex, 1);
        arr.splice(targetIndex, 0, item);
        setDraggedItemIndex(targetIndex);
        return arr;
      });
    }
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  const handleDragOver = (e) => e.preventDefault();

  // ================= TOKEN POSITION =================
  const getTokenPosition = (district, index) => {
    if (!district?.slots?.length) return { x: 0.5, y: 0.5 };

    // không loop random nữa → giữ ổn định layout
    return district.slots[index] || district.slots[district.slots.length - 1];
  };

  // ================= RENDER RANK =================
  const renderColorRanking = () => {
    const tokenImages = {
      0: bloodToken,
      1: coffinToken,
      2: candleToken,
      3: crossToken,
    };

    return (
      <div className="flex flex-col items-center justify-center gap-3 md:gap-4 h-auto py-8 px-3 bg-black/40 backdrop-blur-md rounded-full border border-white/5 shadow-[-5px_0_20px_rgba(0,0,0,0.5)]">
        {ranking.map((colorKey, index) => (
          <React.Fragment key={colorKey}>
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              className={`w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden border border-white/20 shadow-[0_3px_10px_rgba(0,0,0,0.8)] transition-transform cursor-grab active:cursor-grabbing flex items-center justify-center p-2
              ${
                draggedItemIndex === index
                  ? "opacity-50 scale-95 border-game-dracula-orange border-2"
                  : "hover:scale-105 bg-white/5"
              }`}
            >
              <img
                src={tokenImages[colorKey]}
                alt=""
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>

            {index < 3 && (
              <div className="text-white/30">
                <svg width="24" height="14" viewBox="0 0 24 16">
                  <polyline points="4,4 12,12 20,4" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // ================= RENDER =================
  return (
    <div className="flex flex-col h-full justify-center items-center w-full max-w-6xl mx-auto gap-6 py-4 select-none px-2">
      {/* TOP INFO */}
      <div className="w-full flex justify-between items-end px-2 md:px-0">
        <div>
          <span className="text-[10px] text-game-vanhelsing-blood uppercase tracking-[0.3em] font-bold">
            Kẻ Thù
          </span>
          <div className="text-lg text-white/80">{opponent.username}</div>
        </div>
        <div className="text-2xl font-black text-white">{opponent.health}</div>
      </div>

      <div className="flex w-full gap-4 md:gap-8 items-center">
        <div className="flex-1 flex flex-col gap-6">
          {/* OPPONENT HAND */}
          <div className="grid grid-cols-5 gap-3 md:gap-4">
            {opponent.hand.map((card, i) => (
              <Card key={i} isHidden className="rotate-180" />
            ))}
          </div>

          {/* BOARD */}
          <div
            className="w-full relative rounded-md overflow-hidden"
            style={{ aspectRatio: "1536 / 1024" }}
          >
            <img
              src={boardBg}
              alt=""
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />

            {/* TOKENS */}
            {mockGameState.zones.map((zone) => {
              const district = districts.find((d) => d.id === zone.zoneIndex);
              if (!district) return null;

              const humans = Array(zone.humanTokens).fill("human");
              const vampires = Array(zone.vampireTokens).fill("vampire");

              const tokens = [...humans, ...vampires];

              return tokens.map((type, i) => {
                const pos = getTokenPosition(district, i);

                return (
                  <div
                    key={`${zone.zoneIndex}-${i}`}
                    className="absolute"
                    style={{
                      left: `${pos.x * 100}%`,
                      top: `${pos.y * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-[3px]
                        ${
                          type === "human"
                            ? "bg-[#d2c4b3] border-white"
                            : "bg-[#9a1b1f] border-[#e15525] shadow-[0_0_10px_rgba(225,85,37,0.8)]"
                        }`}
                    />
                  </div>
                );
              });
            })}
          </div>

          {/* MY HAND */}
          <div className="grid grid-cols-5 gap-3 md:gap-4">
            {myPlayer.hand.map((card, i) => (
              <Card key={i} cardData={card} />
            ))}
          </div>
        </div>

        <div className="w-20 md:w-28">{renderColorRanking()}</div>
      </div>

      {/* BOTTOM INFO */}
      <div className="w-full flex justify-between px-2">
        <div>{myPlayer.username}</div>
        <div>{myPlayer.health} HP</div>
      </div>
    </div>
  );
};

export default GameBoard;
