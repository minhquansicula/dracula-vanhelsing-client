import React from "react";
import Card from "./Card";
import BoardZone from "./BoardZone";

const GameBoard = () => {
  const mockGameState = {
    roundNumber: 1,
    currentTurnUserId: "user-1",
    colorRanking: [0, 2, 1, 3], // Red > Green > Purple > Yellow
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
        faction: 0, // Dracula
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
        faction: 1, // Van Helsing
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

  // Helper render bảng màu sức mạnh
  const renderColorRanking = () => {
    const colors = {
      0: "bg-red-600",
      1: "bg-fuchsia-600",
      2: "bg-emerald-600",
      3: "bg-amber-500",
    };
    return (
      <div className="flex items-center gap-3 bg-black/40 px-6 py-2 border border-white/10 text-xs font-bold uppercase tracking-widest text-white/50">
        <span>Sức mạnh:</span>
        {mockGameState.colorRanking.map((colorKey, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-sm ${colors[colorKey]} shadow-[0_0_8px_currentColor]`}
            />
            {index < 3 && <span>&gt;</span>}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full justify-between items-center w-full max-w-5xl mx-auto gap-4 py-4">
      {/* THANH THÔNG TIN ĐỐI THỦ (Top) */}
      <div className="w-full flex justify-between items-end px-4 border-b border-white/10 pb-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-game-vanhelsing-blood uppercase tracking-[0.3em] font-bold">
            Kẻ Thù
          </span>
          <span className="text-xl font-['Playfair_Display'] uppercase tracking-widest text-white/80">
            {opponent.username}
          </span>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-game-bone-white font-['Playfair_Display']">
            {opponent.health}
          </span>
          <span className="text-[10px] uppercase text-white/40 ml-1 tracking-widest">
            HP
          </span>
        </div>
      </div>

      {/* BÀI CỦA ĐỐI THỦ (Grid 5 cột dóng thẳng Board) */}
      <div className="w-full grid grid-cols-5 gap-3 md:gap-6 px-4">
        {opponent.hand.map((card, i) => (
          <Card
            key={`opp-card-${i}`}
            isHidden={!card.isRevealed}
            className="rotate-180"
          />
        ))}
      </div>

      {/* BẢNG ƯU TIÊN MÀU SẮC (Color Ranking) */}
      <div className="w-full flex justify-center my-2">
        {renderColorRanking()}
      </div>

      {/* BÀN CỜ CHÍNH (Grid 5 cột) */}
      <div className="w-full grid grid-cols-5 gap-3 md:gap-6 px-4">
        {mockGameState.zones.map((zone) => (
          <BoardZone key={`zone-${zone.zoneIndex}`} zone={zone} />
        ))}
      </div>

      {/* BÀI CỦA MÌNH (Grid 5 cột) */}
      <div className="w-full grid grid-cols-5 gap-3 md:gap-6 px-4 mt-2">
        {myPlayer.hand.map((card, i) => (
          <Card
            key={`my-card-${i}`}
            cardData={card}
            isHidden={card.isRevealed}
          />
        ))}
      </div>

      {/* THANH THÔNG TIN BẢN THÂN (Bottom) */}
      <div className="w-full flex justify-between items-start px-4 border-t border-white/10 pt-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-game-dracula-orange uppercase tracking-[0.3em] font-bold">
            Lãnh Địa Của Bạn
          </span>
          <span className="text-xl font-['Playfair_Display'] uppercase tracking-widest text-white">
            {myPlayer.username}
          </span>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-game-dracula-orange font-['Playfair_Display']">
            {myPlayer.health}
          </span>
          <span className="text-[10px] uppercase text-game-dracula-orange/60 ml-1 tracking-widest">
            HP
          </span>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
