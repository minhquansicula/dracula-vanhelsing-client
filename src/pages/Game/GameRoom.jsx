// src/pages/Game/GameRoom.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Button from "../../components/ui/Button";
import { ROUTES } from "../../constants/routes";
import useGameStore from "../../store/useGameStore";
import { motion, AnimatePresence } from "framer-motion";

import GameBoard from "../../components/game/GameBoard";
import WaitingPhase from "../../components/game/phases/WaitingPhase";
import RoleSelectionPhase from "../../components/game/phases/RoleSelectionPhase";
import TransitionPhase from "../../components/game/phases/TransitionPhase";
import RulebookModal from "../../components/game/RulebookModal";
import SettingsMenu from "../../components/ui/SettingsMenu";

const FACTION = { DRACULA: 0, VAN_HELSING: 1 };
const ROOM_STATUS = { WAITING: 0, PLAYING: 1, FINISHED: 2 };

const GameRoom = () => {
  const { roomCode } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    gameState,
    selectRole,
    surrender,
    error,
    resetGame,
    callEndRound,
    leaveRoom,
    isConnected,
    checkActiveMatch,
    connect,
  } = useGameStore();

  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRulebookOpen, setIsRulebookOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showGameBoard, setShowGameBoard] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // --- CINEMATIC COMBAT ENGINE STATES ---
  const [displayState, setDisplayState] = useState(null);
  const displayStateRef = useRef(null);
  const [combatQueue, setCombatQueue] = useState([]);
  const [currentCombatIndex, setCurrentCombatIndex] = useState(-1);
  const [activeCombatDistrict, setActiveCombatDistrict] = useState(null);
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    if (!isConnected && !error) navigate(ROUTES.LOBBY);
  }, [isConnected, error, navigate]);

  useEffect(() => {
    return () => resetGame();
  }, [resetGame]);

  useEffect(() => {
    const handleReconnect = async () => {
      const token = localStorage.getItem("token");
      if (!isConnected && token) {
        await connect(token);
        const activeCode = await checkActiveMatch();
        if (!activeCode || activeCode !== roomCode) navigate(ROUTES.LOBBY);
      }
      setIsInitialLoading(false);
    };
    handleReconnect();
  }, [isConnected, roomCode, connect, checkActiveMatch, navigate]);

  // ENGINE TẠO KỊCH BẢN GIAO TRANH
  useEffect(() => {
    if (!gameState) return;

    if (!displayStateRef.current) {
      setDisplayState(gameState);
      displayStateRef.current = gameState;
      return;
    }

    const oldState = displayStateRef.current;
    const isNewRound = gameState.roundNumber > oldState.roundNumber;
    const isNewlyFinished =
      gameState.status === ROOM_STATUS.FINISHED &&
      oldState.status === ROOM_STATUS.PLAYING;

    if (
      (isNewRound || isNewlyFinished) &&
      combatQueue.length === 0 &&
      currentCombatIndex === -1
    ) {
      if (isNewlyFinished && gameState.endReason === "Surrender") {
        setDisplayState(gameState);
        displayStateRef.current = gameState;
        return;
      }

      const queue = [];
      let currentDraculaHP = oldState.players.find(
        (p) => p.faction === FACTION.DRACULA,
      ).health;

      for (let i = 0; i < 5; i++) {
        const oldZone = oldState.zones[i];
        const newZone = gameState.zones[i] || oldZone;
        let draculaWon = newZone.vampireTokens > oldZone.vampireTokens;

        queue.push({
          districtIndex: i + 1,
          winner: draculaWon ? FACTION.DRACULA : FACTION.VAN_HELSING,
        });

        if (draculaWon) {
          if (oldZone.vampireTokens + 1 >= 4) break;
        } else {
          currentDraculaHP--;
          if (currentDraculaHP <= 0) break;
        }
      }

      const revealedState = JSON.parse(JSON.stringify(oldState));
      revealedState.players.forEach((p) =>
        p.hand.forEach((c) => (c.isRevealed = true)),
      );
      revealedState.pendingSkillValue = null;

      setDisplayState(revealedState);
      displayStateRef.current = revealedState;
      setCombatQueue(queue);
      setCurrentCombatIndex(0);
    } else if (combatQueue.length === 0) {
      setDisplayState(gameState);
      displayStateRef.current = gameState;
    }
  }, [gameState]);

  // MÁY CHẠY ANIMATION THEO TỪNG NHỊP (TIMELINE)
  useEffect(() => {
    if (currentCombatIndex >= 0 && currentCombatIndex < combatQueue.length) {
      const step = combatQueue[currentCombatIndex];

      setActiveCombatDistrict({ index: step.districtIndex, phase: "focus" });

      const timer1 = setTimeout(() => {
        setActiveCombatDistrict({
          index: step.districtIndex,
          phase: "resolve",
        });

        setDisplayState((prev) => {
          const next = JSON.parse(JSON.stringify(prev));
          const dracula = next.players.find(
            (p) => p.faction === FACTION.DRACULA,
          );
          const vh = next.players.find(
            (p) => p.faction === FACTION.VAN_HELSING,
          );

          if (step.winner === FACTION.DRACULA) {
            vh.hand[step.districtIndex - 1].isLoser = true;
            dracula.hand[step.districtIndex - 1].isWinner = true;
            next.zones[step.districtIndex - 1].humanTokens--;
            next.zones[step.districtIndex - 1].vampireTokens++;
          } else {
            dracula.hand[step.districtIndex - 1].isLoser = true;
            vh.hand[step.districtIndex - 1].isWinner = true;
            dracula.health--;
          }
          displayStateRef.current = next;
          return next;
        });

        const timer2 = setTimeout(() => {
          setActiveCombatDistrict(null);
          setCurrentCombatIndex((idx) => idx + 1);
        }, 1200);

        return () => clearTimeout(timer2);
      }, 800);

      return () => clearTimeout(timer1);
    } else if (
      currentCombatIndex === combatQueue.length &&
      combatQueue.length > 0
    ) {
      setActiveCombatDistrict(null);
      const timer = setTimeout(() => {
        setCombatQueue([]);
        setCurrentCombatIndex(-1);
        setDisplayState(gameState);
        displayStateRef.current = gameState;

        if (gameState.status === ROOM_STATUS.PLAYING) {
          const isFinalRound = gameState.roundNumber === 5;
          setAnnouncement({
            subtitle: isFinalRound
              ? "Đêm cuối cùng. Không còn đường lui."
              : "Phán xét hoàn tất.",
            title: isFinalRound
              ? "TRẬN CHIẾN CUỐI"
              : `BẮT ĐẦU VÒNG ${gameState.roundNumber}`,
            titleClass: isFinalRound
              ? "text-game-vanhelsing-blood drop-shadow-[0_0_50px_rgba(154,27,31,1)]"
              : "text-game-bone-white drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]",
          });
          setTimeout(() => setAnnouncement(null), 3000);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentCombatIndex, combatQueue, gameState]);

  useEffect(() => {
    if (displayState?.status === ROOM_STATUS.PLAYING && !showGameBoard) {
      setIsLoading(false);
      setIsTransitioning(true);

      const transitionTimer = setTimeout(() => {
        setIsTransitioning(false);
        setShowGameBoard(true);
        setAnnouncement({
          subtitle: "Bạn hóa thân thành",
          title: isDracula ? "Dracula" : "Van Helsing",
          titleClass: isDracula
            ? "text-game-dracula-orange drop-shadow-[0_0_40px_rgba(225,85,37,0.8)]"
            : "text-game-vanhelsing-blood drop-shadow-[0_0_40px_rgba(154,27,31,0.8)]",
        });
        setTimeout(() => setAnnouncement(null), 3000);
      }, 2500);
      return () => clearTimeout(transitionTimer);
    }
  }, [displayState?.status, showGameBoard]);

  const isAnimatingCombat = combatQueue.length > 0;
  const targetState = displayState || gameState;

  const myPlayer = targetState?.players?.find(
    (p) => p.userId.toLowerCase() === user?.id?.toLowerCase(),
  );
  const isDracula = myPlayer?.faction === FACTION.DRACULA;
  const isMyTurn =
    !isAnimatingCombat &&
    targetState?.currentTurnUserId?.toLowerCase() === user?.id?.toLowerCase();

  const hasDrawnCard = !!myPlayer?.drawnCard;
  const pendingSkill = targetState?.pendingSkillValue;
  const discardPileLength = targetState?.discardPile?.length || 0;

  const canCallEndRound =
    showGameBoard &&
    isMyTurn &&
    !hasDrawnCard &&
    !pendingSkill &&
    discardPileLength >= 6;

  const handleSelectRole = async (faction) => {
    setSelectedRole(faction);
    setIsLoading(true);
    await selectRole(roomCode, faction);
  };

  const handleSurrender = async () => {
    if (window.confirm("Bạn có chắc chắn muốn bỏ cuộc?")) {
      await surrender(roomCode);
    }
  };

  const handleCallEndRound = async () => {
    if (
      canCallEndRound &&
      window.confirm(
        "Mộ bài đã đủ 6 lá. Bạn có muốn Kết Thúc Vòng ngay lúc này?",
      )
    ) {
      await callEndRound(roomCode);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-game-dark-teal flex flex-col items-center justify-center p-4 text-game-bone-white">
        <h1 className="text-4xl font-black text-game-vanhelsing-blood mb-4 shadow-text-lg">
          Lời Nguyền Lỗi
        </h1>
        <p className="text-center italic bg-game-vanhelsing-blood/20 p-4 border border-game-vanhelsing-blood rounded-sm mb-6">
          {error}
        </p>
        <Button
          onClick={async () => {
            await leaveRoom();
            resetGame();
            navigate(ROUTES.LOBBY);
          }}
          variant="cold"
        >
          Quay lại Sảnh
        </Button>
      </div>
    );
  }

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f12] flex flex-col items-center justify-center">
        <p className="text-game-dracula-orange animate-pulse tracking-[0.5em] uppercase text-xs mb-4">
          Đang khôi phục hiệp ước...
        </p>
      </div>
    );
  }

  const isWaiting =
    !targetState ||
    (targetState.status === ROOM_STATUS.WAITING &&
      targetState.players?.length < 2);
  const isSelectingRole =
    targetState?.status === ROOM_STATUS.WAITING &&
    targetState?.players?.length === 2;
  const isFinished = displayState?.status === ROOM_STATUS.FINISHED;

  const renderCurrentPhase = () => {
    if (isWaiting) return <WaitingPhase roomCode={roomCode} />;
    if (isSelectingRole)
      return (
        <RoleSelectionPhase
          selectedRole={selectedRole}
          isLoading={isLoading}
          onSelectRole={handleSelectRole}
        />
      );
    if (isTransitioning) return <TransitionPhase />;
    if (showGameBoard || isFinished) {
      return (
        <div className="flex-grow w-full h-full animate-in fade-in duration-1000 relative">
          <GameBoard
            displayState={displayState}
            activeCombatDistrict={activeCombatDistrict}
            isAnimatingCombat={isAnimatingCombat}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-game-dark-teal text-game-bone-white relative overflow-hidden flex flex-col font-['Inter'] selection:bg-game-dracula-orange/30">
      {isFinished && !isAnimatingCombat && (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-500">
          <div className="bg-[#0d1316] border border-white/10 p-12 flex flex-col items-center text-center shadow-[0_0_100px_rgba(0,0,0,1)] rounded-sm">
            <h2
              className={`text-5xl md:text-7xl font-black uppercase mb-6 font-['Playfair_Display'] ${targetState.winnerId.toLowerCase() === user.id.toLowerCase() ? "text-game-dracula-orange drop-shadow-[0_0_20px_rgba(225,85,37,0.5)]" : "text-game-vanhelsing-blood drop-shadow-[0_0_20px_rgba(154,27,31,0.5)]"}`}
            >
              {targetState.winnerId.toLowerCase() === user.id.toLowerCase()
                ? "Chiến Thắng"
                : "Thất Bại"}
            </h2>
            <p className="text-white/60 mb-10 uppercase tracking-[0.3em] text-xs font-bold">
              {targetState.endReason === "Surrender"
                ? targetState.winnerId.toLowerCase() === user.id.toLowerCase()
                  ? "Đối thủ đã hèn nhát bỏ cuộc."
                  : "Bạn đã đầu hàng trước nỗi sợ."
                : "Hiệp ước đã kết thúc."}
            </p>
            <Button
              onClick={async () => {
                await leaveRoom();
                resetGame();
                navigate(ROUTES.LOBBY);
              }}
              variant={
                targetState.winnerId.toLowerCase() === user.id.toLowerCase()
                  ? "dracula"
                  : "vanhelsing"
              }
            >
              Trở Về Sảnh Chờ
            </Button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {announcement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
          >
            <div className="flex flex-col items-center text-center">
              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/60 uppercase tracking-[0.5em] text-xs md:text-sm font-bold mb-4"
              >
                {announcement.subtitle}
              </motion.p>
              <h2
                className={`text-6xl md:text-8xl font-black uppercase font-['Playfair_Display'] ${announcement.titleClass}`}
              >
                {announcement.title}
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -bottom-40 -left-40 w-[50vw] h-[50vw] bg-game-vanhelsing-blood rounded-full blur-[200px] opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-[50vw] h-[50vw] bg-game-dracula-orange rounded-full blur-[200px] opacity-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_10%,_rgba(0,0,0,0.7)_100%)]"></div>
      </div>

      {!isTransitioning && (
        <header className="p-6 md:px-10 border-b border-white/5 relative z-20 flex items-center justify-between backdrop-blur-md bg-black/20">
          <div className="flex items-center gap-6 w-1/3">
            <div className="bg-black/40 px-4 py-2 border border-white/5 text-[10px] uppercase tracking-[0.3em] text-game-bone-white/80 font-bold min-w-[180px] text-center">
              {isWaiting && "Đang chờ đối thủ..."}
              {isSelectingRole && "Nghi lễ chọn phe..."}
              {(showGameBoard || isFinished) &&
                targetState &&
                `Vòng ${targetState.roundNumber} - Phe ${isDracula ? "Đêm Tối" : "Thợ Săn"}`}
            </div>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <h2 className="text-xl font-black text-game-bone-white uppercase tracking-widest shadow-text-md font-['Playfair_Display'] hidden xl:block whitespace-nowrap">
              Hiệp Ước:{" "}
              <span className="text-game-dracula-orange tracking-[0.3em] ml-2">
                {roomCode}
              </span>
            </h2>
          </div>

          <div className="flex-1 flex justify-center">
            {showGameBoard && !isFinished && !announcement && (
              <div className="pointer-events-none animate-in fade-in duration-500">
                {isMyTurn ? (
                  <div className="bg-[#0a0f12]/90 border border-game-dracula-orange/60 text-game-dracula-orange px-6 py-1.5 xl:px-8 xl:py-2 rounded-full text-[10px] xl:text-xs font-black uppercase tracking-[0.25em] shadow-[0_0_15px_rgba(225,85,37,0.4)] animate-pulse">
                    Lượt của bạn
                  </div>
                ) : (
                  <div className="bg-[#0a0f12]/80 border border-white/10 text-white/40 px-6 py-1.5 xl:px-8 xl:py-2 rounded-full text-[10px] xl:text-xs font-bold uppercase tracking-[0.2em]">
                    {isAnimatingCombat
                      ? "Đang tiến hành phán xét..."
                      : "Đối thủ đang suy nghĩ..."}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="relative flex justify-end w-1/3 items-center gap-2 xl:gap-4">
            {canCallEndRound && !isFinished && (
              <button
                onClick={handleCallEndRound}
                className="px-4 py-2 mr-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 border whitespace-nowrap bg-game-vanhelsing-blood/20 border-game-vanhelsing-blood text-game-vanhelsing-blood hover:bg-game-vanhelsing-blood hover:text-white shadow-[0_0_15px_rgba(154,27,31,0.5)] animate-in fade-in duration-300"
              >
                Kết Thúc Vòng
              </button>
            )}
            <button
              onClick={() => setIsRulebookOpen(true)}
              className="p-2 text-white/40 hover:text-game-dracula-orange transition-colors duration-300 outline-none"
              title="Sách Luật"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </button>
            <div className="w-px h-6 bg-white/10 hidden sm:block"></div>

            <SettingsMenu
              onLeaveRoom={async () => {
                await leaveRoom();
                resetGame();
                navigate(ROUTES.LOBBY);
              }}
              onSurrender={handleSurrender}
              showSurrender={showGameBoard}
              isFinished={isFinished}
            />
          </div>
        </header>
      )}

      <main
        className={`flex-grow p-6 md:p-10 relative z-10 flex flex-col ${isTransitioning ? "p-0" : ""}`}
      >
        <div className="max-w-7xl mx-auto h-full w-full flex-grow flex flex-col justify-center">
          {renderCurrentPhase()}
        </div>
      </main>

      <RulebookModal
        isOpen={isRulebookOpen}
        onClose={() => setIsRulebookOpen(false)}
      />
    </div>
  );
};

export default GameRoom;
