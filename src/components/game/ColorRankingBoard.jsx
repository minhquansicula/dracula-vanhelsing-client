// src/components/game/ColorRankingBoard.jsx
import React, { useState, useEffect } from "react";

const smoothTransition =
  "transition-[transform,opacity,filter,box-shadow] duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu";

const ColorRankingBoard = ({
  initialRanking,
  onRankingChange,
  isTargeting = false,
  onTargetColorsSubmit,
}) => {
  const [ranking, setRanking] = useState(initialRanking || [0, 1, 2, 3]);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  // State lưu 2 màu đang được click chọn (dành cho Kỹ năng 7)
  const [selectedColors, setSelectedColors] = useState([]);

  const basePath = import.meta.env
    ? import.meta.env.BASE_URL
    : process.env.PUBLIC_URL || "";

  useEffect(() => {
    if (initialRanking) setRanking(initialRanking);
  }, [initialRanking]);

  // Reset lựa chọn nếu hủy chế độ targeting
  useEffect(() => {
    if (!isTargeting) setSelectedColors([]);
  }, [isTargeting]);

  const handleDragStart = (e, index) => {
    if (isTargeting) {
      e.preventDefault();
      return;
    }
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e, targetIndex) => {
    if (isTargeting || draggedItemIndex === null) return;
    if (draggedItemIndex !== targetIndex) {
      const newRanking = [...ranking];
      const item = newRanking[draggedItemIndex];
      newRanking.splice(draggedItemIndex, 1);
      newRanking.splice(targetIndex, 0, item);

      setRanking(newRanking);
      setDraggedItemIndex(targetIndex);
      if (onRankingChange) onRankingChange(newRanking);
    }
  };

  const handleDragEnd = () => setDraggedItemIndex(null);
  const handleDragOver = (e) => e.preventDefault();

  // Xử lý Click chọn màu khi dùng lá số 7
  const handleColorClick = (colorKey) => {
    if (!isTargeting) return;

    let newSelected = [...selectedColors];
    if (newSelected.includes(colorKey)) {
      newSelected = newSelected.filter((c) => c !== colorKey); // Bỏ chọn
    } else {
      newSelected.push(colorKey);
    }

    setSelectedColors(newSelected);

    // Nếu đã chọn đủ 2 màu, tự động gửi Submit
    if (newSelected.length === 2) {
      if (onTargetColorsSubmit) {
        onTargetColorsSubmit(newSelected[0], newSelected[1]);
      }
      setSelectedColors([]); // Reset lại sau khi gửi
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-4 px-2 xl:py-6 xl:px-3 bg-[#0d1316]/80 backdrop-blur-md rounded-full border shadow-[-10px_0_40px_rgba(0,0,0,0.9)] transition-colors duration-500
      ${isTargeting ? "border-game-dracula-orange ring-2 ring-game-dracula-orange/50 shadow-[0_0_30px_rgba(225,85,37,0.3)] animate-pulse" : "border-white/5"}`}
    >
      {ranking.map((colorKey, index) => {
        const isSelected = selectedColors.includes(colorKey);

        return (
          <React.Fragment key={colorKey}>
            <div
              draggable={!isTargeting}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onClick={() => handleColorClick(colorKey)}
              className={`w-14 h-14 xl:w-20 xl:h-20 rounded-full overflow-hidden border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu p-0 flex items-center justify-center
                ${isTargeting ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"}
                ${draggedItemIndex === index ? "opacity-60 scale-90 border-game-dracula-orange border-2 shadow-[0_0_20px_rgba(225,85,37,0.5)] rotate-3" : ""}
                ${isSelected ? "border-game-dracula-orange border-4 scale-110 shadow-[0_0_25px_rgba(225,85,37,0.8)] z-10 brightness-125" : "border-transparent hover:scale-105"}
                ${isTargeting && !isSelected && selectedColors.length > 0 ? "opacity-50 grayscale-[50%]" : ""}
              `}
            >
              <img
                src={`${basePath}images/colors/${colorKey}.png`}
                alt={`Token ${colorKey}`}
                className={`w-full h-full object-cover pointer-events-none ${smoothTransition}`}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />

              {isSelected && (
                <div className="absolute inset-0 bg-game-dracula-orange/20 flex items-center justify-center pointer-events-none">
                  <span className="text-white text-xs font-black drop-shadow-md">
                    ✓
                  </span>
                </div>
              )}
            </div>

            {index < 3 && (
              <div
                className={`text-white/20 shrink-0 transition-opacity duration-300 ${draggedItemIndex !== null ? "opacity-0" : "opacity-100"}`}
              >
                <svg
                  width="16"
                  height="10"
                  viewBox="0 0 24 16"
                  className="w-4 h-2.5 xl:w-5 xl:h-3 drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
                >
                  <polyline
                    points="4,4 12,12 20,4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ColorRankingBoard;
