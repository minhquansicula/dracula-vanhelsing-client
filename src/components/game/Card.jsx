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

  // Thêm viền màu vàng đồng/cam tối cho hợp phong cách Gothic
  const containerClass = `relative w-full h-full rounded-lg overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.8)] border-2 border-[#b8860b]/30 ${className}`;

  if (isHidden || !cardData) {
    return (
      <div className={containerClass}>
        <img
          src={`${basePath}images/cards/card_back.png`}
          alt="Card Back"
          // Zoom 18% để ép viền đen thừa ra ngoài
          className="absolute inset-0 w-full h-full object-cover pointer-events-none block scale-[1.18]"
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
      {/* ẢNH THẺ BÀI */}
      <img
        src={imagePath}
        alt={`Card ${color}-${value}`}
        // THÊM scale-[1.18] TẠI ĐÂY: Phóng to ảnh để cắt bỏ phần viền đen có sẵn trong file PNG
        className="absolute inset-0 w-full h-full object-cover pointer-events-none block scale-[1.18]"
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />

      {/* LỚP PHỦ GRADIENT GÓC: Chuyển sang đỏ đen cho đúng chất Dracula */}
      <div className="absolute top-0 left-0 w-2/3 h-1/2 bg-gradient-to-br from-black/90 via-black/40 to-transparent z-[5] pointer-events-none"></div>

      {/* SỐ THẺ BÀI: Sử dụng Font Gothic cổ điển */}
      <div className="absolute top-1 left-3 xl:top-2 xl:left-4 z-10 select-none">
        {/* Áp dụng font UnifrakturMaguntia, tăng kích thước chữ, đổ bóng đỏ/đen */}
        <span className="text-[#f4e4bc] text-3xl xl:text-5xl font-normal font-['UnifrakturMaguntia',_serif] tracking-tighter drop-shadow-[2px_2px_4px_rgba(0,0,0,1)]">
          {value}
        </span>
      </div>

      {/* Hiệu ứng viền sáng nhẹ bên trong (Inner Glow) */}
      <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] rounded-lg pointer-events-none z-20"></div>
    </div>
  );
};

export default Card;
