// src/constants/preloadAssets.js

import boardBg from "../assets/images/board-bg.png";
import bgCircleImg from "../assets/images/bgCircle.png";

const basePath =
  import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : "/";

// 1. Tạo mảng 32 lá bài
const cardImages = [];
for (let color = 0; color <= 3; color++) {
  for (let value = 1; value <= 8; value++) {
    cardImages.push(`${basePath}images/cards/${color}_${value}.png`);
  }
}

// 2. Tạo mảng 20 token Người
const humanTokens = [];
for (let id = 1; id <= 20; id++) {
  humanTokens.push(`${basePath}images/human/${id}.png`);
}

// 3. Tạo mảng 20 token Vampire
const vampireTokens = [];
for (let id = 21; id <= 40; id++) {
  vampireTokens.push(`${basePath}images/vampire/${id}.png`);
}

// 4. Tạo mảng 4 token Màu
const colorTokens = [];
for (let colorId = 0; colorId <= 3; colorId++) {
  colorTokens.push(`${basePath}images/colors/${colorId}.svg`);
}

export const GAME_ASSETS_TO_PRELOAD = [
  `${basePath}images/board-bg.png`, // ĐÃ SỬA THÀNH CHUỖI GỌI TỪ PUBLIC
  `${basePath}images/bgCircle.png`, // ĐÃ SỬA THÀNH CHUỖI GỌI TỪ PUBLIC
  `${basePath}images/cards/card_back.png`,
  ...cardImages,
  ...humanTokens,
  ...vampireTokens,
  ...colorTokens,
];