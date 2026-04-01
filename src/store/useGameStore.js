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

    newConnection.on("RoomCreated", (roomCode) =>
      set({ roomCode: roomCode, error: null }),
    );
    newConnection.on("RoomReadyToSelectRole", (state) =>
      set({ gameState: state, roomCode: state.roomCode, error: null }),
    );
    newConnection.on("OpponentSelectedRole", () =>
      console.log("[SignalR] OpponentSelectedRole"),
    );
    newConnection.on("GameStateUpdated", (state) =>
      set({ gameState: state, error: null }),
    );
    newConnection.on("GameStarted", (state) =>
      set({ gameState: state, error: null }),
    );
    newConnection.on("GameEnded", (state) => set({ gameState: state }));
    newConnection.on("Error", (message) => set({ error: message }));

    try {
      await newConnection.start();
      set({ connection: newConnection, isConnected: true });
    } catch (err) {
      console.error("SignalR Connection Error: ", err);
      set({ error: "Không thể kết nối đến máy chủ trò chơi." });
    }
  },

  createRoom: async () => {
    try {
      await get().connection?.invoke("CreateRoom");
    } catch (error) {
      set({ error: "Không thể tạo phòng." });
    }
  },

  joinRoom: async (code) => {
    try {
      await get().connection?.invoke("JoinRoom", code);
    } catch (error) {
      set({ error: "Không thể vào phòng." });
    }
  },

  selectRole: async (code, requestedFaction) => {
    try {
      await get().connection?.invoke("SelectRole", code, requestedFaction);
    } catch (error) {
      set({ error: "Lỗi khi chọn vai trò." });
    }
  },

  drawCard: async (code) => {
    try {
      await get().connection?.invoke("DrawCard", code);
    } catch (error) {
      set({ error: "Không thể rút bài." });
    }
  },

  playCard: async (code, discardedCardId) => {
    try {
      await get().connection?.invoke("PlayCard", code, discardedCardId);
    } catch (error) {
      set({ error: "Không thể đánh bài." });
    }
  },

  surrender: async (code) => {
    try {
      await get().connection?.invoke("Surrender", code);
    } catch (error) {
      set({ error: "Lỗi khi đầu hàng." });
    }
  },

  clearError: () => set({ error: null }),
  resetGame: () => set({ gameState: null, roomCode: null, error: null }),
}));

export default useGameStore;
