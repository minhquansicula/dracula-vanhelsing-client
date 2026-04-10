// src/components/game/GameBoard.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import MapTokens from "./MapTokens";
import ColorRankingBoard from "./ColorRankingBoard";
import PlayerHand from "./PlayerHand";
import DeckAndDiscard from "./DeckAndDiscard";
import boardBgImg from "../../assets/images/board-bg.png";

import { districts } from "./bonus/mapConfig";
import { AuthContext } from "../../contexts/AuthContext";
import useGameStore from "../../store/useGameStore";
import TurnTimer from "../ui/TurnTimer";

const smoothTransition =
  "transition-[transform,opacity,filter,box-shadow] duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu";

const GameBoard = ({
  displayState,
  activeCombatDistrict,
  isAnimatingCombat,
}) => {
  const { roomCode } = useParams();
  const { user } = useContext(AuthContext);
  const { drawCard, playCard, submitSkillAction, readyForNextRound, isActionPending } = useGameStore();

  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [selectedOwnCards, setSelectedOwnCards] = useState([]);

  const gameState = displayState;

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

  // Khoá tương tác nếu đang trong quá trình Combat
  const isMyTurn =
    !isAnimatingCombat &&
    gameState.currentTurnUserId.toLowerCase() === user.id.toLowerCase();
  const isReviewPhase = gameState.status === 3 || gameState.status === "CombatReview";
  const myPlayerReady = myPlayer?.isReadyForNextRound;
  const hasDrawnCard = !!myPlayer?.drawnCard;
  const pendingSkill = gameState.pendingSkillValue;

  const isTargetingOpponentCard =
    isMyTurn && (pendingSkill === 3 || pendingSkill === 6);
  const isTargetingOwnCardSingle = isMyTurn && pendingSkill === 1;
  const isTargetingOwnCardDouble = isMyTurn && pendingSkill === 4;
  const isTargetingColor = isMyTurn && pendingSkill === 7;

  const topDiscardCardId =
    gameState.discardPile.length > 0
      ? gameState.discardPile[gameState.discardPile.length - 1]
      : null;
  const topDeckCardId =
    gameState.isTopDeckCardRevealed && gameState.drawPile.length > 0
      ? gameState.drawPile[0]
      : null;

  const handleDrawCard = async () => {
    if (isMyTurn && !hasDrawnCard && !pendingSkill) await drawCard(roomCode);
  };

  const handlePlayCard = async (discardedCardId) => {
    if (isMyTurn && hasDrawnCard && !pendingSkill)
      await playCard(roomCode, discardedCardId);
  };

  const handleTargetOpponentCard = async (targetCardId) => {
    if (isTargetingOpponentCard)
      await submitSkillAction(roomCode, { targetCardId: targetCardId });
  };

  const handleTargetOwnCard = async (targetCardId) => {
    const targetCard = myPlayer?.hand?.find((c) => c.cardId === targetCardId);

    if (isTargetingOwnCardSingle) {
      if (targetCard && targetCard.isRevealed) {
        alert("Lá bài này đã lộ diện rồi! Hãy chọn một lá đang úp nhé.");
        return;
      }
      await submitSkillAction(roomCode, { targetCardId: targetCardId });
    } else if (isTargetingOwnCardDouble) {
      let newSelected = [...selectedOwnCards];
      if (newSelected.includes(targetCardId)) {
        newSelected = newSelected.filter((id) => id !== targetCardId);
      } else {
        newSelected.push(targetCardId);
      }
      setSelectedOwnCards(newSelected);
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
    if (isTargetingColor)
      await submitSkillAction(roomCode, {
        targetColor1: color1,
        targetColor2: color2,
      });
  };

  return (
    // THÊM: Biến isActionPending để khóa màn hình (pointer-events-none) và làm mờ khi đang gọi API
    <div 
      className={`fixed inset-0 pt-24 pb-8 w-full h-full bg-[#0a0f12] flex items-center justify-center font-['Inter'] px-8 select-none overflow-hidden box-border perspective-1000 transition-all duration-300
      ${isActionPending ? "pointer-events-none opacity-90 grayscale-[20%]" : ""}`}
    >
      {/* 1. THANH TURN TIMER NẰM Ở TRÊN CÙNG */}
      <TurnTimer 
        currentTurnUserId={gameState.currentTurnUserId}
        myUserId={user.id}
        status={gameState.status}
      />

      {/* 2. MÀN HÌNH CHỜ COMBAT REVIEW (NGHIỆM THI) */}
      {isReviewPhase && !isAnimatingCombat && (
        <div className="fixed bottom-8 xl:bottom-12 left-1/2 -translate-x-1/2 z-[60] animate-bounce-slight">
          <div className="bg-[#05080a]/95 border border-game-dracula-orange/40 px-6 py-4 xl:px-8 xl:py-5 flex flex-row items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-full backdrop-blur-md">
            
            <div className="flex flex-col items-start">
              <h2 className="text-lg xl:text-xl font-black text-game-dracula-orange tracking-widest uppercase">
                Vòng {gameState.roundNumber} kết thúc
              </h2>
              <p className="text-white/60 text-xs xl:text-sm">
                Hai bên hãy kiểm tra lại kết quả
              </p>
            </div>

            <div className="w-px h-10 bg-white/10"></div> {/* Đường kẻ dọc phân cách */}

            {myPlayerReady ? (
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white/50 font-bold uppercase text-sm flex items-center gap-3">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Chờ đối thủ...
              </div>
            ) : (
              <button
                onClick={() => readyForNextRound(roomCode)}
                className="px-8 py-3 bg-game-dracula-orange text-black font-black uppercase text-sm xl:text-base rounded-full shadow-[0_0_20px_rgba(225,85,37,0.5)] hover:scale-105 hover:bg-white transition-all cursor-pointer pointer-events-auto"
              >
                Sẵn sàng Vòng {gameState.roundNumber + 1}
              </button>
            )}
          </div>
        </div>
      )}
      {/* CÁC KHỐI POPUP CŨ CỦA BẠN GIỮ NGUYÊN BÊN DƯỚI */}
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
            topDeckCardId={topDeckCardId}
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
            forcedDistrict={activeCombatDistrict}
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
                src={boardBgImg}
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
                  const isFightingNow = activeCombatDistrict === district.id;
                  const isHovered =
                    isFightingNow ||
                    (!activeCombatDistrict && hoveredDistrict === district.id);
                  const isOthersHovered = activeCombatDistrict
                    ? !isFightingNow
                    : hoveredDistrict !== null &&
                      hoveredDistrict !== district.id;

                  return (
                    <polygon
                      key={district.id}
                      points={district.rawPolygon
                        .map((p) => p.join(","))
                        .join(" ")}
                      className="pointer-events-auto cursor-pointer transition-colors duration-500 ease-in-out"
                      style={{
                        fill: isFightingNow
                          ? "rgba(255, 255, 255, 0.15)"
                          : isOthersHovered
                            ? "rgba(0, 0, 0, 0.6)"
                            : isHovered
                              ? "rgba(255, 255, 255, 0.1)"
                              : "transparent",
                        stroke: "transparent",
                        strokeWidth: "0",
                      }}
                      onMouseEnter={() =>
                        !isAnimatingCombat && setHoveredDistrict(district.id)
                      }
                      onMouseLeave={() =>
                        !isAnimatingCombat && setHoveredDistrict(null)
                      }
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
            forcedDistrict={activeCombatDistrict}
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
