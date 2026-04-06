// src/components/game/GameBoard.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import MapTokens from "./MapTokens";
import ColorRankingBoard from "./ColorRankingBoard";
import PlayerHand from "./PlayerHand";
import DeckAndDiscard from "./DeckAndDiscard";

import boardBg from "../../assets/images/board-bg.png";
import { districts } from "./bonus/mapConfig";
import { AuthContext } from "../../contexts/AuthContext";
import useGameStore from "../../store/useGameStore";

const smoothTransition =
  "transition-[transform,opacity,filter,box-shadow] duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu";

const GameBoard = () => {
  const { roomCode } = useParams();
  const { user } = useContext(AuthContext);
  const { gameState, drawCard, playCard, submitSkillAction } = useGameStore();

  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  // State lưu trữ các lá bài của bản thân được chọn (Dành cho kỹ năng 4)
  const [selectedOwnCards, setSelectedOwnCards] = useState([]);

  // Reset selection khi pendingSkillValue thay đổi
  useEffect(() => {
    setSelectedOwnCards([]);
  }, [gameState?.pendingSkillValue]);

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
  const pendingSkill = gameState.pendingSkillValue;

  // Phân loại các trạng thái chờ kỹ năng
  const isTargetingOpponentCard =
    isMyTurn && (pendingSkill === 3 || pendingSkill === 6);
  const isTargetingOwnCardSingle = isMyTurn && pendingSkill === 1;
  const isTargetingOwnCardDouble = isMyTurn && pendingSkill === 4;
  const isTargetingColor = isMyTurn && pendingSkill === 7;

  const topDiscardCardId =
    gameState.discardPile.length > 0
      ? gameState.discardPile[gameState.discardPile.length - 1]
      : null;

  const handleDrawCard = async () => {
    if (isMyTurn && !hasDrawnCard && !pendingSkill) {
      await drawCard(roomCode);
    }
  };

  const handlePlayCard = async (discardedCardId) => {
    if (isMyTurn && hasDrawnCard && !pendingSkill) {
      await playCard(roomCode, discardedCardId);
    }
  };

  const handleTargetOpponentCard = async (targetCardId) => {
    if (isTargetingOpponentCard) {
      await submitSkillAction(roomCode, { targetCardId: targetCardId });
    }
  };

  const handleTargetOwnCard = async (targetCardId) => {
    if (isTargetingOwnCardSingle) {
      await submitSkillAction(roomCode, { targetCardId: targetCardId });
    } else if (isTargetingOwnCardDouble) {
      let newSelected = [...selectedOwnCards];
      if (newSelected.includes(targetCardId)) {
        newSelected = newSelected.filter((id) => id !== targetCardId); // Bỏ chọn
      } else {
        newSelected.push(targetCardId); // Chọn thêm
      }

      setSelectedOwnCards(newSelected);

      // Đủ 2 lá thì tự động submit
      if (newSelected.length === 2) {
        await submitSkillAction(roomCode, {
          targetCardId: newSelected[0],
          targetCardId2: newSelected[1],
        });
        setSelectedOwnCards([]);
      }
    }
  };

  const handleTargetColorSubmit = async (color1, color2) => {
    if (isTargetingColor) {
      await submitSkillAction(roomCode, {
        targetColor1: color1,
        targetColor2: color2,
      });
    }
  };

  return (
    <div className="fixed inset-0 pt-24 pb-8 w-full h-full bg-[#0a0f12] flex items-center justify-center font-['Inter'] px-8 select-none overflow-y-auto box-border perspective-1000">
      {/* BANNER THÔNG BÁO KỸ NĂNG 3, 6 (Chọn 1 bài đối thủ) */}
      {isTargetingOpponentCard && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center">
          <div className="bg-game-vanhelsing-blood/90 backdrop-blur-md border border-game-vanhelsing-blood text-white px-8 py-3 rounded-full text-sm xl:text-base font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(154,27,31,0.8)] animate-pulse flex items-center gap-3">
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
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
            CHỌN 1 LÁ BÀI CỦA ĐỐI THỦ
          </div>
        </div>
      )}

      {/* BANNER THÔNG BÁO KỸ NĂNG 1 (Chọn 1 bài bản thân) */}
      {isTargetingOwnCardSingle && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center">
          <div className="bg-game-dracula-orange/90 backdrop-blur-md border border-game-dracula-orange text-black px-8 py-3 rounded-full text-sm xl:text-base font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(225,85,37,0.8)] animate-pulse flex items-center gap-3">
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            CHỌN 1 LÁ BÀI CỦA BẠN ĐỂ LỘ DIỆN
          </div>
        </div>
      )}

      {/* BANNER THÔNG BÁO KỸ NĂNG 4 (Chọn 2 bài bản thân) */}
      {isTargetingOwnCardDouble && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center">
          <div className="bg-game-dracula-orange/90 backdrop-blur-md border border-game-dracula-orange text-black px-8 py-3 rounded-full text-sm xl:text-base font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(225,85,37,0.8)] animate-pulse flex items-center gap-3">
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
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            CHỌN 2 LÁ BÀI CỦA BẠN ĐỂ TRÁO ({selectedOwnCards.length}/2)
          </div>
        </div>
      )}

      {/* BANNER THÔNG BÁO KỸ NĂNG 7 (Chọn màu) */}
      {isTargetingColor && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center">
          <div className="bg-game-dracula-orange/90 backdrop-blur-md border border-game-dracula-orange text-black px-8 py-3 rounded-full text-sm xl:text-base font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(225,85,37,0.8)] animate-pulse flex items-center gap-3">
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            CHỌN 2 MÀU ĐỂ HOÁN ĐỔI
          </div>
        </div>
      )}

      <div className="w-full max-w-[1600px] flex flex-row items-center justify-center gap-8 xl:gap-12 h-full max-h-[900px] relative">
        <div className="shrink-0 flex flex-col justify-center gap-8 xl:gap-12 relative">
          <DeckAndDiscard
            drawPileCount={gameState.drawPile.length}
            topDiscardCard={
              topDiscardCardId
                ? { cardId: topDiscardCardId, isRevealed: true }
                : null
            }
            onDraw={handleDrawCard}
            isMyTurn={isMyTurn}
            hasDrawnCard={hasDrawnCard}
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-6 xl:gap-8 flex-1 max-w-[900px] relative">
          <PlayerHand
            player={opponent}
            type="opponent"
            hoveredDistrict={hoveredDistrict}
            setHoveredDistrict={setHoveredDistrict}
            isMyTurn={false}
            hasDrawnCard={false}
            drawnCard={null}
            onPlayCard={() => {}}
            isTargeting={isTargetingOpponentCard}
            onTargetClick={handleTargetOpponentCard}
          />

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

          <PlayerHand
            player={myPlayer}
            type="self"
            hoveredDistrict={hoveredDistrict}
            setHoveredDistrict={setHoveredDistrict}
            isMyTurn={isMyTurn}
            hasDrawnCard={hasDrawnCard}
            drawnCard={myPlayer?.drawnCard}
            onPlayCard={handlePlayCard}
            isTargeting={isTargetingOwnCardSingle || isTargetingOwnCardDouble}
            onTargetClick={handleTargetOwnCard}
            selectedCards={selectedOwnCards}
          />
        </div>

        <div className="shrink-0 flex flex-col justify-center gap-8 xl:gap-12">
          <ColorRankingBoard
            initialRanking={gameState.colorRanking}
            onRankingChange={(newRanking) => {}}
            isTargeting={isTargetingColor}
            onTargetColorsSubmit={handleTargetColorSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
