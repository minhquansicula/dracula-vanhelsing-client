// src/utils/AudioManager.js
import { Howl, Howler } from "howler";

class AudioManager {
  constructor() {
    this.audioUnlocked = false;

    // Lưu trữ âm lượng mặc định (Từ 0.0 đến 1.0)
    this.bgmVolume = 0.5;
    this.sfxVolume = 0.8;

    // 1. CẤU HÌNH NHẠC NỀN (BGM)
    this.bgm = new Howl({
      src: ["../src/assets/sounds/test.ogg"],
      loop: true,
      volume: this.bgmVolume,
    });

    // 2. CẤU HÌNH HIỆU ỨNG ÂM THANH (SFX)
    this.sfx = {
      draw: new Howl({
        src: ["../src/assets/sounds/draw.webm"],
        volume: this.sfxVolume,
      }),
      play: new Howl({
        src: ["../src/assets/sounds/play.webm"],
        volume: this.sfxVolume,
      }),
      clash: new Howl({
        src: ["../src/assets/sounds/clash.webm"],
        volume: 1.0,
      }), // Có thể để max vì tiếng này cần to
      win: new Howl({
        src: ["../src/assets/sounds/win.webm"],
        volume: this.sfxVolume,
      }),
      lose: new Howl({
        src: ["../src/assets/sounds/lose.webm"],
        volume: this.sfxVolume,
      }),
      transition: new Howl({
        src: ["../src/assets/sounds/transition.webm"],
        volume: this.sfxVolume * 0.8,
      }),
    };

    // Mở khóa âm thanh khi click lần đầu
    const unlockAudio = () => {
      if (!this.audioUnlocked) {
        this.audioUnlocked = true;
        if (this.bgmVolume > 0 && !this.bgm.playing()) {
          this.bgm.play();
        }
        document.removeEventListener("click", unlockAudio);
        document.removeEventListener("keydown", unlockAudio);
        document.removeEventListener("touchstart", unlockAudio);
      }
    };

    document.addEventListener("click", unlockAudio);
    document.addEventListener("keydown", unlockAudio);
    document.addEventListener("touchstart", unlockAudio);
  }

  // --- QUẢN LÝ NHẠC NỀN (BGM) ---
  playBGM() {
    if (this.bgmVolume > 0 && !this.bgm.playing() && this.audioUnlocked) {
      this.bgm.play();
    }
  }

  stopBGM() {
    this.bgm.stop();
  }

  setBgmVolume(val) {
    this.bgmVolume = parseFloat(val);
    this.bgm.volume(this.bgmVolume);

    // Nếu kéo slider lớn hơn 0 mà nhạc chưa chạy thì phát luôn
    if (this.bgmVolume > 0 && !this.bgm.playing()) {
      this.audioUnlocked = true;
      this.bgm.play();
    } else if (this.bgmVolume === 0) {
      this.bgm.pause();
    }
  }

  // --- QUẢN LÝ HIỆU ỨNG (SFX) ---
  playSFX(name) {
    if (this.sfxVolume > 0 && this.sfx[name]) {
      this.sfx[name].play();
    }
  }

  setSfxVolume(val) {
    this.sfxVolume = parseFloat(val);
    // Duyệt qua tất cả các SFX và cập nhật âm lượng
    Object.keys(this.sfx).forEach((key) => {
      // Riêng tiếng clash (chém) thì cho to hơn bình thường 1 chút để tạo lực
      if (key === "clash")
        this.sfx[key].volume(Math.min(1, this.sfxVolume * 1.2));
      else if (key === "transition") this.sfx[key].volume(this.sfxVolume * 0.8);
      else this.sfx[key].volume(this.sfxVolume);
    });
  }
}

export const audioManager = new AudioManager();
