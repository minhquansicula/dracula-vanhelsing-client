import React, { useEffect } from "react";
import { districts } from "./bonus/mapConfig";

const MapTokens = ({ zones }) => {
  const basePath =
    import.meta.env && import.meta.env.BASE_URL
      ? import.meta.env.BASE_URL
      : "/";

  useEffect(() => {
    console.log("🎮 [MapTokens] Dữ liệu Zones từ Backend:", zones);
  }, [zones]);

  const getTokenPosition = (district, index) => {
    if (!district?.slots?.length) return { x: 0.5, y: 0.5 };
    return district.slots[index] || district.slots[district.slots.length - 1];
  };

  if (!zones || !Array.isArray(zones) || zones.length === 0) return null;

  // Khởi tạo biến đếm toàn cục trong mỗi lần render để chia ID ảnh không bị trùng lắp
  // Dân làng: 1 -> 20 | Ma cà rồng: 21 -> 40
  let humanImageId = 1;
  let vampireImageId = 21;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {zones.map((zone) => {
        const district = districts.find((d) => d.id === zone.zoneIndex);
        if (!district) return null;

        // Mảng tạm để chứa các token ảo được đẻ ra từ số đếm của Backend
        const visualTokens = [];

        // 1. Đẻ ra Token Người dựa theo zone.humanTokens
        for (let i = 0; i < (zone.humanTokens || 0); i++) {
          visualTokens.push({
            type: "human",
            // Giới hạn max là 20 để không bị gọi ảnh 21.png của thư mục human
            imageId: humanImageId > 20 ? 20 : humanImageId++,
          });
        }

        // 2. Đẻ ra Token Vampire dựa theo zone.vampireTokens
        for (let i = 0; i < (zone.vampireTokens || 0); i++) {
          visualTokens.push({
            type: "vampire",
            // Giới hạn max là 40 để không bị gọi ảnh 41.png
            imageId: vampireImageId > 40 ? 40 : vampireImageId++,
          });
        }

        // Render ra giao diện dựa trên mảng visualTokens vừa tạo
        return visualTokens.map((token, index) => {
          const pos = getTokenPosition(district, index);
          const imagePath = `${basePath}images/${token.type}/${token.imageId}.png`;

          return (
            <div
              key={`${zone.zoneIndex}-${token.type}-${index}`}
              className="absolute w-[15%] aspect-square z-10 transition-all duration-300"
              style={{
                left: `${pos.x * 100}%`,
                top: `${pos.y * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <img
                src={imagePath}
                alt={`${token.type} Token ${token.imageId}`}
                className="w-full h-full object-contain pointer-events-none drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
                onError={(e) => {
                  console.error(`🚨 Lỗi không tải được Token: ${imagePath}`);
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
