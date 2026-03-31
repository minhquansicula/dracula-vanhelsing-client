// src/constants/preloadAssets.js

import boardBg from "../assets/images/board-bg.png";

const basePath =
  import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : "/";

// 1. Tạo mảng 32 lá bài
const cardImages = [];
for (let color = 0; color <= 3; color++) {
  for (let value = 1; value <= 8; value++) {
    cardImages.push(`${basePath}images/cards/${color}_${value}.png`);
  }
}

// 2. Tạo mảng 20 token Người (ID từ 1 - 20)
const humanTokens = [];
for (let id = 1; id <= 20; id++) {
  humanTokens.push(`${basePath}images/human/${id}.png`);
}

// 3. Tạo mảng 20 token Vampire (ID từ 21 - 40)
const vampireTokens = [];
for (let id = 21; id <= 40; id++) {
  vampireTokens.push(`${basePath}images/vampire/${id}.png`);
}

// 4. Tạo mảng 4 token Màu (ID từ 0 - 3 tương ứng 4 màu)
// Lưu ý: Hãy điều chỉnh lại đường dẫn "images/colors/" cho khớp với thư mục thực tế của bạn
const colorTokens = [];
for (let colorId = 0; colorId <= 3; colorId++) {
  colorTokens.push(`${basePath}images/colors/${colorId}.svg`);
}

export const GAME_ASSETS_TO_PRELOAD = [
  boardBg,
  `${basePath}images/cards/card_back.png`,
  ...cardImages,
  ...humanTokens,
  ...vampireTokens,
  ...colorTokens, // Thêm token màu vào danh sách nạp
];
