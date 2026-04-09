// src/components/game/ColorRankingBoard.jsx
import React, { useState, useEffect } from "react";
import bgCircleImg from "../../assets/images/bgCircle.png";

const smoothTransition =
  "transition-[transform,opacity,filter,box-shadow] duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu";

const ColorRankingBoard = ({
  initialRanking,
  isTargeting = false,
  onTargetColorsSubmit,
}) => {
  const [ranking, setRanking] = useState(initialRanking || [0, 1, 2, 3]);
  const [selectedColors, setSelectedColors] = useState([]);

  const basePath = import.meta.env
    ? import.meta.env.BASE_URL
    : process.env.PUBLIC_URL || "";

  useEffect(() => {
    if (initialRanking) setRanking(initialRanking);
  }, [initialRanking]);

  useEffect(() => {
    if (!isTargeting) setSelectedColors([]);
  }, [isTargeting]);

  const handleColorClick = (colorKey) => {
    if (!isTargeting) return;

    let newSelected = [...selectedColors];
    if (newSelected.includes(colorKey)) {
      newSelected = newSelected.filter((c) => c !== colorKey);
    } else {
      newSelected.push(colorKey);
    }

    setSelectedColors(newSelected);

    if (newSelected.length === 2) {
      if (onTargetColorsSubmit) {
        onTargetColorsSubmit(newSelected[0], newSelected[1]);
      }
      setSelectedColors([]);
    }
  };

  // HÀM HELPER: Render Token (Kích thước ĐỒNG NHẤT cho tất cả)
  const renderToken = (colorKey, isTrump = false) => {
    const isSelected = selectedColors.includes(colorKey);

    // Dùng 1 kích thước duy nhất cho TẤT CẢ các token
    const sizeClass = "w-14 h-14 xl:w-[86px] xl:h-[86px]";

    return (
      <div
        key={colorKey}
        onClick={() => handleColorClick(colorKey)}
        className={`relative ${sizeClass} rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu shrink-0
          ${isTargeting ? "cursor-pointer hover:scale-110 hover:-translate-y-1" : "cursor-default"}
          ${isSelected ? "border-game-dracula-orange border-4 scale-110 shadow-[0_0_25px_rgba(225,85,37,0.9)] z-30 brightness-125" : "border-transparent"}
          ${isTargeting && !isSelected && selectedColors.length > 0 ? "opacity-50 grayscale-[60%]" : ""}
          ${isTrump && !isSelected ? "ring-[3px] ring-yellow-500/80 shadow-[0_0_25px_rgba(234,179,8,0.6)] z-20" : "z-10"}
        `}
      >
        {/* Vòng tròn vàng phát sáng bao quanh bên dưới dành riêng cho Trump Token */}
        {isTrump && !isSelected && (
          <div className="absolute -inset-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 blur-md pointer-events-none animate-pulse"></div>
        )}

        <img
          src={`${basePath}images/colors/${colorKey}.png`}
          alt={`Token ${colorKey}`}
          className={`w-full h-full rounded-full object-cover pointer-events-none relative z-10 drop-shadow-[0_8px_15px_rgba(0,0,0,0.8)] ${smoothTransition}`}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />

        {/* Lớp phủ (Overlay) khi được click chọn */}
        {isSelected && (
          <div className="absolute inset-0 rounded-full bg-game-dracula-orange/30 flex items-center justify-center pointer-events-none z-40 backdrop-blur-[1px]">
            <span className="text-white text-xl xl:text-2xl font-black drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">
              ✓
            </span>
          </div>
        )}
      </div>
    );
  };

  // Tách mảng: Index 0 là Trump (Cao nhất), Index 1, 2, 3 là các màu phụ
  const trumpColor = ranking[0];
  const otherColors = ranking.slice(1);

  return (
    // Bỏ `overflow-hidden`, viền và background của container để hình ảnh tùy ý scale
    <div
      className={`relative flex flex-row items-center justify-start h-[360px] w-[180px] xl:h-[580px] xl:w-[290px] pl-4 xl:pl-6 transition-all duration-500
      ${isTargeting ? "drop-shadow-[0_0_30px_rgba(225,85,37,0.8)] brightness-125 animate-pulse" : ""}`}
    >
      {/* ẢNH BACKGROUND NẰM Ở ĐÂY LỚP DƯỚI CÙNG (z-0) */}
      <img
        src={bgCircleImg}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover object-right opacity-90 z-0 pointer-events-none scale-[1.55] origin-right translate-x-12 xl:translate-x-16"
      />

      {/* CỘT TRÁI: 3 Token phụ xếp dọc */}
      <div className="flex flex-col items-center justify-center gap-3 xl:gap-5 relative z-20">
        {otherColors.map((colorKey, index) => (
          <React.Fragment key={colorKey}>
            {renderToken(colorKey, false)}

            {/* Mũi tên */}
            {index < 2 && (
              <div className="text-white/40 shrink-0 transition-opacity duration-300">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 xl:w-6 xl:h-6 drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="5"
                    stroke="currentColor"
                    fill="none"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* CỘT PHẢI: Trump Token (Nằm giữa, toả sáng) */}
      <div className="flex flex-col items-center justify-center ml-3 xl:ml-5 relative z-10">
        {/* Hào quang (Ambient Glow) lan tỏa mạnh phía sau lưng Trump */}
        <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full scale-[2.0] pointer-events-none"></div>
        {renderToken(trumpColor, true)}
      </div>
    </div>
  );
};

export default ColorRankingBoard;
