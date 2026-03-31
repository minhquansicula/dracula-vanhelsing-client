// src/store/useGameStore.js
import { create } from "zustand";
import * as signalR from "@microsoft/signalr";

const useGameStore = create((set, get) => ({
  connection: null,
  isConnected: false,
  gameState: null,
  error: null,
  roomCode: null,

  connect: async (token) => {
    if (get().connection) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7295/gamehub", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    newConnection.on("RoomCreated", (roomCode) => {
      set({ roomCode: roomCode, error: null });
    });

    newConnection.on("RoomReadyToSelectRole", (state) => {
      set({ gameState: state, roomCode: state.roomCode, error: null });
    });

    newConnection.on("OpponentSelectedRole", () => {
      // Có thể thêm thông báo đối thủ đã chọn xong
    });

    newConnection.on("GameStateUpdated", (state) => {
      set({ gameState: state, error: null });
    });

    newConnection.on("GameStarted", (state) => {
      set({ gameState: state, error: null });
    });

    // Lắng nghe sự kiện kết thúc game (Đầu hàng, Thắng/Thua thông thường)
    newConnection.on("GameEnded", (state) => {
      set({ gameState: state });
    });

    newConnection.on("Error", (message) => {
      set({ error: message });
    });

    try {
      await newConnection.start();
      set({ connection: newConnection, isConnected: true });
    } catch (err) {
      console.error("SignalR Connection Error: ", err);
      set({ error: "Không thể kết nối đến máy chủ trò chơi." });
    }
  },

  createRoom: async () => {
    const { connection } = get();
    if (connection) {
      await connection.invoke("CreateRoom");
    }
  },

  joinRoom: async (code) => {
    const { connection } = get();
    if (connection) {
      await connection.invoke("JoinRoom", code);
    }
  },

  selectRole: async (code, requestedFaction) => {
    const { connection } = get();
    if (connection) {
      await connection.invoke("SelectRole", code, requestedFaction);
    }
  },

  drawCard: async (code) => {
    const { connection } = get();
    if (connection) {
      await connection.invoke("DrawCard", code);
    }
  },

  playCard: async (code, discardedCardId) => {
    const { connection } = get();
    if (connection) {
      await connection.invoke("PlayCard", code, discardedCardId);
    }
  },

  surrender: async (code) => {
    const { connection } = get();
    if (connection) {
      await connection.invoke("Surrender", code);
    }
  },

  clearError: () => set({ error: null }),
  resetGame: () => set({ gameState: null, roomCode: null, error: null }),
}));

export default useGameStore;
