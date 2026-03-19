import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Button from "../../components/ui/Button";
import { ROUTES } from "../../constants/routes";
import GameBoard from "../../components/game/GameBoard";

const GameRoom = () => {
  const { roomCode } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const FACTION = { DRACULA: 0, VAN_HELSING: 1 };

  // GIẢ LẬP LUỒNG GAME
  useEffect(() => {
    setGameState({
      status: 0,
      players: [{ userId: user?.id || "me", faction: null }],
    });

    const opponentJoinTimer = setTimeout(() => {
      setGameState({
        status: 1,
        roomCode: roomCode,
        roundNumber: 1,
        players: [
          { userId: user?.id || "me", faction: null },
          { userId: "opponent-999", faction: null },
        ],
      });
    }, 4000);

    return () => clearTimeout(opponentJoinTimer);
  }, [roomCode, user]);

  const handleSelectRole = (faction) => {
    setSelectedRole(faction);
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setGameState((prevState) => ({
        ...prevState,
        players: [
          {
            userId: user?.id || "me",
            faction: faction,
            health: faction === FACTION.DRACULA ? 12 : 0,
          },
          {
            userId: "opponent-999",
            faction:
              faction === FACTION.DRACULA
                ? FACTION.VAN_HELSING
                : FACTION.DRACULA,
            health: faction === FACTION.DRACULA ? 0 : 12,
          },
        ],
      }));
    }, 2000);
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
        <Button variant="cold" onClick={() => navigate(ROUTES.LOBBY)}>
          Quay lại Sảnh
        </Button>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="min-h-screen bg-game-dark-teal flex items-center justify-center text-game-bone-white uppercase tracking-[0.3em] font-black text-sm animate-pulse">
        Đang triệu hồi state trận đấu...
      </div>
    );
  }

  const isDracula =
    gameState.players.find((p) => p.userId === (user?.id || "me"))?.faction ===
    FACTION.DRACULA;
  const isWaiting = gameState.status === 0;
  const isPlaying = gameState.status === 1;

  const allPlayersSelectedRole =
    gameState.players.length === 2 &&
    gameState.players.every((p) => p.faction !== null);
  const isSelectingRole = isPlaying && !allPlayersSelectedRole;
  const isActualPlaying = isPlaying && allPlayersSelectedRole;

  return (
    <div className="min-h-screen bg-game-dark-teal text-game-bone-white relative overflow-hidden flex flex-col font-['Inter'] selection:bg-game-dracula-orange/30">
      {/* Background decoration - Hiệu ứng ánh sáng nền sâu hơn */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -bottom-40 -left-40 w-[50vw] h-[50vw] bg-game-vanhelsing-blood rounded-full blur-[200px] opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-[50vw] h-[50vw] bg-game-dracula-orange rounded-full blur-[200px] opacity-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_10%,_rgba(0,0,0,0.7)_100%)]"></div>
      </div>

      {/* Header - Sửa nút Thoát */}
      <header className="p-6 md:px-10 border-b border-white/5 relative z-20 flex items-center justify-between backdrop-blur-md bg-black/20">
        <div className="flex items-center gap-6">
          {/* Nút thoát thiết kế theo kiểu in-game UI */}
          <button
            onClick={() => navigate(ROUTES.LOBBY)}
            className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-white/40 hover:text-white transition-all duration-300"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            Rút Lui
          </button>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <h2 className="text-xl font-black text-game-bone-white uppercase tracking-widest shadow-text-md font-['Playfair_Display']">
            Hiệp Ước:{" "}
            <span className="text-game-dracula-orange tracking-[0.3em] ml-2">
              {roomCode}
            </span>
          </h2>
        </div>
        <div className="bg-black/40 px-4 py-2 border border-white/5 text-[10px] uppercase tracking-[0.3em] text-game-bone-white/50 font-bold hidden md:block">
          {isWaiting && "Đang chờ đối thủ..."}
          {isSelectingRole && "Nghi lễ chọn phe..."}
          {isActualPlaying &&
            `Vòng ${gameState.roundNumber} - Phe ${isDracula ? "Đêm Tối" : "Thợ Săn"}`}
        </div>
      </header>

      <main className="flex-grow p-6 md:p-10 relative z-10 flex flex-col">
        <div className="max-w-7xl mx-auto h-full w-full flex-grow flex flex-col">
          {/* GIAI ĐOẠN 1: CHỜ NGƯỜI CHƠI (Waiting) */}
          {isWaiting && (
            <div className="flex-grow flex flex-col items-center justify-center h-full text-center">
              <div className="h-px w-32 bg-game-bone-white/10 relative overflow-hidden mb-12">
                <div className="absolute inset-0 bg-game-dracula-orange w-1/2 animate-[pulse_1.5s_infinite_ease-in-out] shadow-[0_0_15px_rgba(225,85,37,0.8)]" />
              </div>

              <h3 className="text-5xl md:text-7xl font-black text-game-bone-white uppercase mb-4 font-['Playfair_Display'] tracking-tighter drop-shadow-2xl">
                Kẻ Thách Thức
              </h3>
              <p className="text-game-bone-white/40 uppercase tracking-[0.4em] max-w-md mb-12 text-xs font-bold">
                Chưa xuất hiện
              </p>

              {/* Box chứa code được làm cho ma mị và game hơn */}
              <div className="group relative bg-black/60 p-8 px-16 border-y border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] mb-12 overflow-hidden transition-all hover:border-game-dracula-orange/30">
                <div className="absolute inset-0 bg-game-dracula-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse" />
                <span className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-[0.3em] drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] relative z-10 font-['Playfair_Display'] select-all">
                  {roomCode}
                </span>
              </div>

              <p className="text-[10px] uppercase tracking-widest text-game-dracula-orange/60 animate-pulse font-bold">
                Tự động giả lập đối thủ sau 3 giây...
              </p>
            </div>
          )}

          {/* GIAI ĐOẠN 2: CHỌN PHE (Selecting Role) */}
          {isSelectingRole && (
            <div className="flex-grow flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-1000">
              <header className="text-center mb-16 flex-shrink-0">
                <h3 className="text-5xl md:text-6xl font-black text-game-bone-white uppercase mb-6 font-['Playfair_Display'] tracking-tighter drop-shadow-2xl">
                  Chọn Số Phận
                </h3>
                <div className="w-px h-16 bg-gradient-to-b from-white/30 to-transparent mx-auto"></div>
              </header>

              <div className="grid md:grid-cols-2 gap-8 md:gap-12 w-full max-w-5xl items-stretch">
                {/* Option 1: Dracula */}
                <div
                  className={`group relative bg-black/40 p-10 md:p-14 border transition-all duration-500 flex flex-col items-center h-full overflow-hidden
                    ${
                      selectedRole === FACTION.DRACULA
                        ? "border-game-dracula-orange shadow-[0_0_50px_rgba(225,85,37,0.3)] scale-105 z-10 bg-game-dracula-orange/5"
                        : selectedRole !== null
                          ? "border-white/5 opacity-30 scale-95 grayscale"
                          : "border-white/10 hover:border-game-dracula-orange/50 hover:shadow-[0_0_40px_rgba(225,85,37,0.15)] hover:-translate-y-2 cursor-pointer"
                    }`}
                  onClick={() =>
                    !isLoading && handleSelectRole(FACTION.DRACULA)
                  }
                >
                  <div className="h-24 flex items-end mb-10">
                    <div
                      className={`w-px transition-all duration-700 ease-out group-hover:h-24 ${selectedRole === FACTION.DRACULA ? "h-24 bg-game-dracula-orange shadow-[0_0_20px_rgba(225,85,37,1)]" : "h-12 bg-game-dracula-orange/40"}`}
                    />
                  </div>
                  <h4 className="text-3xl md:text-4xl font-black text-game-bone-white uppercase tracking-tight mb-6 font-['Playfair_Display'] group-hover:text-game-dracula-orange transition-colors">
                    Dracula
                  </h4>
                  <p className="text-game-bone-white/50 text-[11px] text-center uppercase tracking-[0.2em] leading-loose mb-12 flex-grow max-w-[280px]">
                    Sở hữu 12 HP. Nhiệm vụ: Lan truyền Ma cà rồng ra ít nhất 1
                    khu vực hoặc tiêu diệt kẻ đi săn.
                  </p>
                  <Button
                    variant="dracula"
                    size="lg"
                    className={`w-full transition-all duration-500 font-['Playfair_Display'] font-bold tracking-[0.2em] ${selectedRole === FACTION.DRACULA ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                    isLoading={isLoading && selectedRole === FACTION.DRACULA}
                    disabled={isLoading || selectedRole !== null}
                  >
                    {selectedRole === FACTION.DRACULA
                      ? "Đã Khóa Lựa Chọn"
                      : "Lãnh Đạo Đêm Tối"}
                  </Button>
                </div>

                {/* Option 2: Van Helsing */}
                <div
                  className={`group relative bg-black/40 p-10 md:p-14 border transition-all duration-500 flex flex-col items-center h-full overflow-hidden
                    ${
                      selectedRole === FACTION.VAN_HELSING
                        ? "border-game-vanhelsing-blood shadow-[0_0_50px_rgba(154,27,31,0.3)] scale-105 z-10 bg-game-vanhelsing-blood/5"
                        : selectedRole !== null
                          ? "border-white/5 opacity-30 scale-95 grayscale"
                          : "border-white/10 hover:border-game-vanhelsing-blood/50 hover:shadow-[0_0_40px_rgba(154,27,31,0.15)] hover:-translate-y-2 cursor-pointer"
                    }`}
                  onClick={() =>
                    !isLoading && handleSelectRole(FACTION.VAN_HELSING)
                  }
                >
                  <div className="h-24 flex items-end mb-10">
                    <div
                      className={`w-px transition-all duration-700 ease-out group-hover:h-24 ${selectedRole === FACTION.VAN_HELSING ? "h-24 bg-game-vanhelsing-blood shadow-[0_0_20px_rgba(154,27,31,1)]" : "h-12 bg-game-vanhelsing-blood/40"}`}
                    />
                  </div>
                  <h4 className="text-3xl md:text-4xl font-black text-game-bone-white uppercase tracking-tight mb-6 font-['Playfair_Display'] group-hover:text-game-vanhelsing-blood transition-colors">
                    Vanhelsing
                  </h4>
                  <p className="text-game-bone-white/50 text-[11px] text-center uppercase tracking-[0.2em] leading-loose mb-12 flex-grow max-w-[280px]">
                    Nhiệm vụ: Tiêu diệt Lãnh chúa Dracula trước khi kết thúc 5
                    vòng đấu.
                  </p>
                  <Button
                    variant="vanhelsing"
                    size="lg"
                    className={`w-full transition-all duration-500 font-['Playfair_Display'] font-bold tracking-[0.2em] ${selectedRole === FACTION.VAN_HELSING ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                    isLoading={
                      isLoading && selectedRole === FACTION.VAN_HELSING
                    }
                    disabled={isLoading || selectedRole !== null}
                  >
                    {selectedRole === FACTION.VAN_HELSING
                      ? "Đã Khóa Lựa Chọn"
                      : "Trở Thành Thợ Săn"}
                  </Button>
                </div>
              </div>

              <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] mt-12 font-bold animate-pulse">
                Định mệnh chỉ gọi tên một người
              </p>
            </div>
          )}

          {/* GIAI ĐOẠN 3: ĐANG CHƠI (Actual Playing) */}
          {isActualPlaying && (
            <div className="flex-grow w-full h-full animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <GameBoard />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GameRoom;
