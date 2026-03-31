// src/utils/assetLoader.js
import { GAME_ASSETS_TO_PRELOAD } from "../constants/preloadAssets";

// Sử dụng Set để lưu trữ các đối tượng Image trong RAM, tránh bị Garbage Collector dọn dẹp
const globalImageCache = new Set();
let isPreloaded = false;

export const preloadGameAssets = () => {
  if (isPreloaded) return; // Nếu đã tải rồi thì không tải lại nữa

  GAME_ASSETS_TO_PRELOAD.forEach((url) => {
    const img = new Image();
    img.src = url;

    // Đẩy ảnh vào Set để giữ nó sống trong RAM suốt vòng đời của thẻ Tab trình duyệt
    globalImageCache.add(img);
  });

  isPreloaded = true;
  console.log("Toàn bộ tài nguyên game đã được nạp vào RAM.");
};
