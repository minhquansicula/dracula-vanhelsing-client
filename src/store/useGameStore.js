// src/store/useGameStore.js
import { create } from "zustand";
import { signalrService } from "../services/signalrService";

const useGameStore = create((set, get) => ({
  isConnected: false,
  gameState: null,
  error: null,
  roomCode: null,
  isActionPending: false,

  connect: async (token) => {
    if (get().isConnected) return;

    try {
      await signalrService.connect(token, {
        onRoomCreated: (roomCode) => set({ roomCode: roomCode, error: null }),
        onRoomReadyToSelectRole: (state) =>
          set({ gameState: state, roomCode: state.roomCode, error: null }),
        onOpponentSelectedRole: () =>
          console.log("[GameStore] Đối thủ đã chọn xong phe"),
        onGameStateUpdated: (state) => set({ gameState: state, error: null }),
        onGameStarted: (state) => set({ gameState: state, error: null }),
        onGameEnded: (state) => set({ gameState: state }),
        onError: (message) => set({ error: message }),
      });

      set({ isConnected: true });
    } catch (err) {
      set({ error: "Không thể kết nối đến máy chủ trò chơi." });
    }
  },

  checkActiveMatch: async () => {
    try {
      const activeRoomCode = await signalrService.checkCurrentActiveMatch();
      if (activeRoomCode) {
        set({ roomCode: activeRoomCode });
        return activeRoomCode;
      }
    } catch (err) {
      console.error("Lỗi khi kiểm tra trận đấu cũ: ", err);
    }
    return null;
  },

  disconnect: async () => {
    await signalrService.disconnect();
    set({ isConnected: false, gameState: null, roomCode: null, error: null });
  },

  createRoom: async () => {
    try {
      await signalrService.createRoom();
    } catch (error) {
      set({ error: "Không thể tạo phòng." });
    }
  },

  joinRoom: async (code) => {
    try {
      await signalrService.joinRoom(code);
    } catch (error) {
      set({ error: "Không thể vào phòng." });
    }
  },

  leaveRoom: async () => {
    try {
      await signalrService.leaveRoom();
      set({ roomCode: null, gameState: null, error: null });
    } catch (error) {
      console.error("Lỗi khi rời phòng:", error);
    }
  },

  selectRole: async (code, requestedFaction) => {
    try {
      await signalrService.selectRole(code, requestedFaction);
    } catch (error) {
      set({ error: "Lỗi khi chọn vai trò." });
    }
  },

  drawCard: async (roomCode) => {
    if (get().isActionPending) {
        console.warn("Spam click bị chặn (DrawCard)!");
        return;
    }
    set({ isActionPending: true });
    try {
      // Lưu ý: Cần đảm bảo file `signalrService.js` của bạn có hàm `drawCard(roomCode)`
      // Nếu chưa có, bạn phải thêm vào signalrService.js: drawCard: (roomCode) => connection.invoke("DrawCard", roomCode)
      await signalrService.connection.invoke("DrawCard", roomCode);
    } catch (err) {
      console.error("Lỗi bóc bài:", err);
    } finally {
      set({ isActionPending: false });
    }
  },

  playCard: async (roomCode, discardedCardId) => {
    if (get().isActionPending) return;
    set({ isActionPending: true });
    try {
      await signalrService.connection.invoke("PlayCard", roomCode, discardedCardId);
    } catch (err) {
      console.error("Lỗi đánh bài:", err);
    } finally {
      set({ isActionPending: false });
    }
  },

  submitSkillAction: async (roomCode, payload) => {
    if (get().isActionPending) return;
    set({ isActionPending: true });
    try {
      await signalrService.connection.invoke("SubmitSkillAction", roomCode, payload);
    } catch (err) {
      console.error("Lỗi dùng skill:", err);
    } finally {
      set({ isActionPending: false });
    }
  },

  callEndRound: async (roomCode) => {
    if (get().isActionPending) return;
    set({ isActionPending: true });
    try {
      await signalrService.connection.invoke("CallEndRound", roomCode);
    } catch (err) {
      console.error("Lỗi kết thúc vòng:", err);
    } finally {
      set({ isActionPending: false });
    }
  },

  readyForNextRound: async (roomCode) => {
    if (get().isActionPending) return;
    set({ isActionPending: true });
    try {
      await signalrService.connection.invoke("ReadyForNextRound", roomCode); 
    } catch (err) {
      console.error("Lỗi xác nhận qua vòng:", err);
    } finally {
      set({ isActionPending: false });
    }
  },

  surrender: async (code) => {
    try {
      await signalrService.surrender(code);
    } catch (error) {
      set({ error: "Lỗi khi đầu hàng." });
    }
  },

  clearError: () => set({ error: null }),
  resetGame: () => set({ gameState: null, roomCode: null, error: null }),
}));

export default useGameStore;