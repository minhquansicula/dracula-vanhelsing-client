// src/components/game/MapTokens.jsx

import React from "react";
import { districts } from "../../components/game/bonus/mapConfig";

const MapTokens = ({ zones }) => {
  // Lấy basePath an toàn
  const basePath =
    import.meta.env && import.meta.env.BASE_URL
      ? import.meta.env.BASE_URL
      : "/";

  const getTokenPosition = (district, index) => {
    if (!district?.slots?.length) return { x: 0.5, y: 0.5 };
    return district.slots[index] || district.slots[district.slots.length - 1];
  };

  if (!zones || !Array.isArray(zones)) return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {zones.map((zone) => {
        const district = districts.find((d) => d.id === zone.zoneIndex);
        if (!district || !zone.tokens) return null;

        return zone.tokens.map((token, i) => {
          const pos = getTokenPosition(district, i);

          // Chuẩn hóa status từ Backend để tránh lỗi phân biệt hoa/thường (ví dụ: "Human" vs "human")
          const statusStr = String(token.status).toLowerCase();
          const isHuman = statusStr === "human" || statusStr === "0";

          // Xử lý ID an toàn: Nếu backend đã trả về ID 21-40 cho Vampire thì giữ nguyên, nếu trả 1-20 thì mới cộng thêm 20
          let imgName = token.id;
          if (!isHuman && token.id <= 20) {
            imgName = token.id + 20;
          }

          const folder = isHuman ? "human" : "vampire";
          const imagePath = `${basePath}images/${folder}/${imgName}.png`;

          return (
            <div
              key={`${zone.zoneIndex}-${i}-${token.id}`}
              className="absolute w-[15%] aspect-square z-10"
              style={{
                left: `${pos.x * 100}%`,
                top: `${pos.y * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <img
                src={imagePath}
                alt={`${folder} Token ${token.id}`}
                className="w-full h-full object-contain pointer-events-none drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
                onError={(e) => {
                  console.error(`Lỗi không tải được Token: ${imagePath}`);
                  e.target.style.display = "none";
                }}
              />
            </div>
          );
        });
      })}
    </div>
  );
};

export default MapTokens;
