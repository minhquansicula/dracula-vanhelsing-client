import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Button from "../../components/ui/Button";
import { ROUTES } from "../../constants/routes";
import useGameStore from "../../store/useGameStore";

import GameBoard from "../../components/game/GameBoard";
import WaitingPhase from "../../components/game/phases/WaitingPhase";
import RoleSelectionPhase from "../../components/game/phases/RoleSelectionPhase";

const FACTION = { DRACULA: 0, VAN_HELSING: 1 };
const ROOM_STATUS = { WAITING: 0, PLAYING: 1, FINISHED: 2 };

const GameRoom = () => {
  const { roomCode } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { gameState, selectRole, surrender, error, resetGame } = useGameStore();

  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    return () => resetGame();
  }, [resetGame]);

  useEffect(() => {
    if (gameState?.status === ROOM_STATUS.PLAYING) {
      setIsLoading(false);
    }
  }, [gameState]);

  const handleSelectRole = async (faction) => {
    setSelectedRole(faction);
    setIsLoading(true);
    await selectRole(roomCode, faction);
  };

  const handleSurrender = async () => {
    if (window.confirm("Bạn có chắc chắn muốn bỏ cuộc?")) {
      await surrender(roomCode);
      setIsSettingsOpen(false);
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
          onClick={() => {
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

  const myPlayer = gameState?.players?.find(
    (p) => p.userId.toLowerCase() === user?.id?.toLowerCase(),
  );
  const isDracula = myPlayer?.faction === FACTION.DRACULA;
  const isMyTurn =
    gameState?.currentTurnUserId?.toLowerCase() === user?.id?.toLowerCase();

  const isWaiting =
    !gameState ||
    (gameState.status === ROOM_STATUS.WAITING && gameState.players?.length < 2);
  const isSelectingRole =
    gameState?.status === ROOM_STATUS.WAITING &&
    gameState?.players?.length === 2;
  const isActualPlaying = gameState?.status === ROOM_STATUS.PLAYING;
  const isFinished = gameState?.status === ROOM_STATUS.FINISHED;

  const renderCurrentPhase = () => {
    if (isWaiting) return <WaitingPhase roomCode={roomCode} />;
    if (isSelectingRole) {
      return (
        <RoleSelectionPhase
          selectedRole={selectedRole}
          isLoading={isLoading}
          onSelectRole={handleSelectRole}
        />
      );
    }
    if (isActualPlaying || isFinished) {
      return (
        <div className="flex-grow w-full h-full animate-in fade-in slide-in-from-bottom-10 duration-1000 relative">
          <GameBoard />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-game-dark-teal text-game-bone-white relative overflow-hidden flex flex-col font-['Inter'] selection:bg-game-dracula-orange/30">
      {isFinished && (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-500">
          <div className="bg-[#0d1316] border border-white/10 p-12 flex flex-col items-center text-center shadow-[0_0_100px_rgba(0,0,0,1)] rounded-sm">
            <h2
              className={`text-5xl md:text-7xl font-black uppercase mb-6 font-['Playfair_Display'] ${gameState.winnerId.toLowerCase() === user.id.toLowerCase() ? "text-game-dracula-orange drop-shadow-[0_0_20px_rgba(225,85,37,0.5)]" : "text-game-vanhelsing-blood drop-shadow-[0_0_20px_rgba(154,27,31,0.5)]"}`}
            >
              {gameState.winnerId.toLowerCase() === user.id.toLowerCase()
                ? "Chiến Thắng"
                : "Thất Bại"}
            </h2>
            <p className="text-white/60 mb-10 uppercase tracking-[0.3em] text-xs font-bold">
              {gameState.endReason === "Surrender"
                ? gameState.winnerId.toLowerCase() === user.id.toLowerCase()
                  ? "Đối thủ đã hèn nhát bỏ cuộc."
                  : "Bạn đã đầu hàng trước nỗi sợ."
                : "Hiệp ước đã kết thúc."}
            </p>
            <Button
              onClick={() => {
                resetGame();
                navigate(ROUTES.LOBBY);
              }}
              variant={
                gameState.winnerId.toLowerCase() === user.id.toLowerCase()
                  ? "dracula"
                  : "vanhelsing"
              }
            >
              Trở Về Sảnh Chờ
            </Button>
          </div>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -bottom-40 -left-40 w-[50vw] h-[50vw] bg-game-vanhelsing-blood rounded-full blur-[200px] opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-[50vw] h-[50vw] bg-game-dracula-orange rounded-full blur-[200px] opacity-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_10%,_rgba(0,0,0,0.7)_100%)]"></div>
      </div>

      <header className="p-6 md:px-10 border-b border-white/5 relative z-20 flex items-center justify-between backdrop-blur-md bg-black/20">
        <div className="flex items-center gap-6 w-1/3">
          <div className="bg-black/40 px-4 py-2 border border-white/5 text-[10px] uppercase tracking-[0.3em] text-game-bone-white/80 font-bold min-w-[180px] text-center">
            {isWaiting && "Đang chờ đối thủ..."}
            {isSelectingRole && "Nghi lễ chọn phe..."}
            {(isActualPlaying || isFinished) &&
              `Vòng ${gameState.roundNumber} - Phe ${isDracula ? "Đêm Tối" : "Thợ Săn"}`}
          </div>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <h2 className="text-xl font-black text-game-bone-white uppercase tracking-widest shadow-text-md font-['Playfair_Display'] hidden xl:block whitespace-nowrap">
            Hiệp Ước:{" "}
            <span className="text-game-dracula-orange tracking-[0.3em] ml-2">
              {roomCode}
            </span>
          </h2>
        </div>

        {/* TRUNG TÂM: Thông báo lượt chơi */}
        <div className="flex-1 flex justify-center">
          {isActualPlaying && (
            <div className="pointer-events-none">
              {isMyTurn ? (
                <div className="bg-[#0a0f12]/90 border border-game-dracula-orange/60 text-game-dracula-orange px-6 py-1.5 xl:px-8 xl:py-2 rounded-full text-[10px] xl:text-xs font-black uppercase tracking-[0.25em] shadow-[0_0_15px_rgba(225,85,37,0.4)] animate-pulse">
                  Lượt của bạn
                </div>
              ) : (
                <div className="bg-[#0a0f12]/80 border border-white/10 text-white/40 px-6 py-1.5 xl:px-8 xl:py-2 rounded-full text-[10px] xl:text-xs font-bold uppercase tracking-[0.2em]">
                  Đối thủ đang suy nghĩ...
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative flex justify-end w-1/3">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 text-white/40 hover:text-white hover:rotate-90 transition-all duration-300 outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          {isSettingsOpen && (
            <div className="absolute top-full mt-4 right-0 w-56 bg-[#0d1316]/95 backdrop-blur-md border border-white/10 rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">
                  Tùy chỉnh
                </p>
              </div>
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  resetGame();
                  navigate(ROUTES.LOBBY);
                }}
                className="w-full text-left px-4 py-3 text-xs uppercase tracking-widest text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                disabled={isActualPlaying}
              >
                Về Sảnh (Thoát)
              </button>
              {isActualPlaying && (
                <button
                  onClick={handleSurrender}
                  className="w-full text-left px-4 py-3 text-xs uppercase tracking-widest text-game-vanhelsing-blood hover:bg-game-vanhelsing-blood/10 transition-colors font-bold"
                >
                  Đầu Hàng
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow p-6 md:p-10 relative z-10 flex flex-col">
        <div className="max-w-7xl mx-auto h-full w-full flex-grow flex flex-col">
          {renderCurrentPhase()}
        </div>
      </main>
    </div>
  );
};

export default GameRoom;
