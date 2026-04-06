// src/services/signalrService.js
import * as signalR from "@microsoft/signalr";

class SignalRService {
  constructor() {
    this.connection = null;
  }

  async connect(token, callbacks) {
    if (this.connection) return;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7295/gamehub", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect() // Tự động kết nối lại nếu rớt mạng
      .build();

    // Đăng ký các sự kiện lắng nghe từ Backend, đẩy dữ liệu vào callbacks để Store xử lý
    this.connection.on("RoomCreated", callbacks.onRoomCreated);
    this.connection.on(
      "RoomReadyToSelectRole",
      callbacks.onRoomReadyToSelectRole,
    );
    this.connection.on(
      "OpponentSelectedRole",
      callbacks.onOpponentSelectedRole,
    );
    this.connection.on("GameStateUpdated", callbacks.onGameStateUpdated);
    this.connection.on("GameStarted", callbacks.onGameStarted);
    this.connection.on("GameEnded", callbacks.onGameEnded);
    this.connection.on("Error", callbacks.onError);

    try {
      await this.connection.start();
      console.log("[SignalR] Kết nối thành công");
    } catch (err) {
      console.error("[SignalR] Lỗi kết nối: ", err);
      throw err;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      console.log("[SignalR] Đã ngắt kết nối");
    }
  }

  // --- CÁC HÀM GỬI LỆNH XUỐNG BACKEND ---
  async createRoom() {
    return this.connection?.invoke("CreateRoom");
  }

  async joinRoom(code) {
    return this.connection?.invoke("JoinRoom", code);
  }

  async selectRole(code, requestedFaction) {
    return this.connection?.invoke("SelectRole", code, requestedFaction);
  }

  async drawCard(code) {
    return this.connection?.invoke("DrawCard", code);
  }

  async playCard(code, discardedCardId) {
    return this.connection?.invoke("PlayCard", code, discardedCardId);
  }

  async submitSkillAction(code, payload) {
    return this.connection?.invoke("SubmitSkillAction", code, payload);
  }

  async surrender(code) {
    return this.connection?.invoke("Surrender", code);
  }
}

// Xuất ra một instance duy nhất (Singleton Pattern)
export const signalrService = new SignalRService();
