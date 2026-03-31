// src/components/game/Card.jsx
import React from "react";

const getCardDetails = (cardId) => {
  if (!cardId) return { color: 0, value: 1 };
  const colorIndex = Math.floor((cardId - 1) / 8);
  const value = ((cardId - 1) % 8) + 1;
  return { color: colorIndex, value: value };
};

const Card = ({ cardData, isHidden, className = "" }) => {
  const basePath = import.meta.env
    ? import.meta.env.BASE_URL
    : process.env.PUBLIC_URL || "";

  // Container đảm bảo tràn viền và bo góc nhẹ
  const containerClass = `relative w-full h-full rounded-lg overflow-hidden shadow-2xl border border-white/5 ${className}`;

  if (isHidden || !cardData) {
    return (
      <div className={containerClass}>
        <img
          src={`${basePath}images/cards/card_back.png`}
          alt="Card Back"
          // object-cover giúp ảnh lấp đầy toàn bộ div mà không bị biến dạng
          className="absolute inset-0 w-full h-full object-cover pointer-events-none block"
        />
      </div>
    );
  }

  const color =
    cardData.color !== undefined
      ? cardData.color
      : getCardDetails(cardData.cardId).color;
  const value =
    cardData.value !== undefined
      ? cardData.value
      : getCardDetails(cardData.cardId).value;

  const imagePath = `${basePath}images/cards/${color}_${value}.png`;

  return (
    <div className={containerClass}>
      {/* ẢNH THẺ BÀI: Ép to lên bằng đúng 100% kích thước của DIV */}
      <img
        src={imagePath}
        alt={`Card ${color}-${value}`}
        // object-cover: Đảm bảo ảnh luôn lấp đầy div, xóa bỏ mọi khoảng trống
        // w-full h-full: Ép chiều rộng và chiều cao khớp tuyệt đối với div cha
        className="absolute inset-0 w-full h-full object-cover pointer-events-none block"
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />

      {/* LỚP PHỦ GRADIENT GÓC: Giúp số dễ đọc hơn */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-black/80 via-black/20 to-transparent z-[5] pointer-events-none"></div>

      {/* SỐ THẺ BÀI: Nằm trực tiếp bên trong layout ảnh */}
      <div className="absolute top-2 left-4 z-10 select-none">
        <span className="text-white text-2xl xl:text-4xl font-black font-['Playfair_Display'] italic tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,1)]">
          {value}
        </span>
      </div>

      {/* Hiệu ứng viền sáng nhẹ bên trong để thẻ bài trông cao cấp hơn */}
      <div className="absolute inset-0 border border-white/10 rounded-lg pointer-events-none z-20"></div>
    </div>
  );
};

export default Card;
