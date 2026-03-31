// src/components/game/GameBoard.jsx
import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import MapTokens from "./MapTokens";
import ColorRankingBoard from "./ColorRankingBoard";
import PlayerHand from "./PlayerHand";
import DeckAndDiscard from "./DeckAndDiscard";
import Card from "./Card";

import boardBg from "../../assets/images/board-bg.png";
import { districts } from "../../components/game/bonus/mapConfig";
import { AuthContext } from "../../contexts/AuthContext";
import useGameStore from "../../store/useGameStore";

const smoothTransition =
  "transition-[transform,opacity,filter,box-shadow] duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu";

const GameBoard = () => {
  const { roomCode } = useParams();
  const { user } = useContext(AuthContext);
  const { gameState, drawCard, playCard } = useGameStore();

  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  if (!gameState) return null;

  const myPlayer = gameState.players.find(
    (p) => p.userId.toLowerCase() === user.id.toLowerCase(),
  );
  const opponent = gameState.players.find(
    (p) => p.userId.toLowerCase() !== user.id.toLowerCase(),
  );

  const isMyTurn =
    gameState.currentTurnUserId.toLowerCase() === user.id.toLowerCase();
  const hasDrawnCard = !!myPlayer?.drawnCard;

  const topDiscardCardId =
    gameState.discardPile.length > 0
      ? gameState.discardPile[gameState.discardPile.length - 1]
      : null;

  const handleDrawCard = async () => {
    if (isMyTurn && !hasDrawnCard) {
      await drawCard(roomCode);
    }
  };

  const handlePlayCard = async (discardedCardId) => {
    if (isMyTurn && hasDrawnCard) {
      await playCard(roomCode, discardedCardId);
    }
  };

  return (
    <div className="fixed inset-0 pt-24 pb-8 w-full h-full bg-[#0a0f12] flex items-center justify-center font-['Inter'] px-8 select-none overflow-y-auto box-border perspective-1000">
      <div className="w-full max-w-[1600px] flex flex-row items-center justify-center gap-8 xl:gap-12 h-full max-h-[900px]">
        {/* LEFT COLUMN: Deck & Discard */}
        <div className="shrink-0 flex flex-col justify-center gap-8 xl:gap-12 relative">
          <DeckAndDiscard
            drawPileCount={gameState.drawPile.length}
            topDiscardCard={
              topDiscardCardId
                ? { cardId: topDiscardCardId, isRevealed: true }
                : null
            }
            onDraw={handleDrawCard}
            onDiscard={() => {}}
            isMyTurn={isMyTurn}
            hasDrawnCard={hasDrawnCard}
          />
        </div>

        {/* MIDDLE COLUMN: Players & Board */}
        <div className="flex flex-col items-center justify-center gap-4 xl:gap-8 flex-1 max-w-[900px] relative">
          {/* OPPONENT ROW */}
          <PlayerHand
            player={opponent}
            type="opponent"
            hoveredDistrict={hoveredDistrict}
            setHoveredDistrict={setHoveredDistrict}
            isMyTurn={false}
            hasDrawnCard={false}
            drawnCard={null}
            onPlayCard={() => {}}
          />

          {/* BOARD CONTAINER */}
          <div
            className={`w-full relative shadow-[0_20px_80px_rgba(0,0,0,0.9)] rounded-xl overflow-hidden border border-[#232a30] bg-[#05080a] ${smoothTransition}`}
          >
            <div
              style={{ aspectRatio: "1536 / 1024" }}
              className="w-full relative"
            >
              <img
                src={boardBg}
                alt="Board Background"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              <MapTokens zones={gameState.zones} />
              <svg
                className="absolute inset-0 w-full h-full z-20 pointer-events-none"
                viewBox="0 0 1536 1024"
                preserveAspectRatio="none"
              >
                {districts.map((district) => {
                  const isHovered = hoveredDistrict === district.id;
                  const isOthersHovered =
                    hoveredDistrict !== null && hoveredDistrict !== district.id;
                  return (
                    <polygon
                      key={district.id}
                      points={district.rawPolygon
                        .map((p) => p.join(","))
                        .join(" ")}
                      className="pointer-events-auto cursor-pointer transition-colors duration-500 ease-in-out"
                      style={{
                        fill: isOthersHovered
                          ? "rgba(0, 0, 0, 0.75)"
                          : isHovered
                            ? "rgba(255, 255, 255, 0.15)"
                            : "transparent",
                        stroke: "transparent",
                        strokeWidth: "0",
                      }}
                      onMouseEnter={() => setHoveredDistrict(district.id)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* MY PLAYER ROW */}
          <PlayerHand
            player={myPlayer}
            type="self"
            hoveredDistrict={hoveredDistrict}
            setHoveredDistrict={setHoveredDistrict}
            isMyTurn={isMyTurn}
            hasDrawnCard={hasDrawnCard}
            drawnCard={myPlayer?.drawnCard} // Truyền lá bài rút xuống cho PlayerHand
            onPlayCard={handlePlayCard}
          />
        </div>

        {/* RIGHT COLUMN: Color Ranking */}
        <div className="shrink-0 flex flex-col justify-center gap-8 xl:gap-12">
          <ColorRankingBoard
            initialRanking={gameState.colorRanking}
            onRankingChange={(newRanking) => {
              // Logic xử lý lá bài Kỹ năng 7
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
