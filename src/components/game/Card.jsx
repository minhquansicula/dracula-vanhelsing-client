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
  const containerClass = `relative w-full h-full rounded-md xl:rounded-lg overflow-hidden shadow-[0_15px_25px_rgba(0,0,0,0.9)] bg-[#050505] group ${className}`;

  if (isHidden || !cardData) {
    return (
      <div className={containerClass}>
        <img
          src={`${basePath}images/cards/card_back.png`}
          alt="Card Back"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none block scale-[1.13]"
        />
        <div className="absolute inset-0 border-2 border-[#b8860b]/20 rounded-md xl:rounded-lg pointer-events-none z-20"></div>
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
  // Khai báo đường dẫn lấy ảnh icon kỹ năng dựa theo value của thẻ bài
  const skillIconPath = `${basePath}images/skills/${value}.png`;

  return (
    <div className={containerClass}>
      <img
        src={imagePath}
        alt={`Card ${color}-${value}`}
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none block scale-[1.22]"
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.6)_100%)] pointer-events-none z-[2]"></div>
      {/* <div className="absolute top-0 left-0 w-3/4 h-1/2 bg-gradient-to-br from-black/95 via-black/50 to-transparent z-[5] pointer-events-none"></div> */}

      <div className="absolute top-1 left-2 xl:top-2 xl:left-3 z-10 select-none">
        <span
          className="text-3xl xl:text-[42px] font-normal font-['UnifrakturMaguntia',_serif] tracking-tighter"
          style={{
            background:
              "linear-gradient(180deg, #FFFDE4 0%, #D4AF37 40%, #8B6508 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter:
              "drop-shadow(2px 3px 1px rgba(0,0,0,0.9)) drop-shadow(0px 0px 8px rgba(0,0,0,0.8))",
          }}
        >
          {value}
        </span>
      </div>

      {/* ICON KỸ NĂNG: Gọi trực tiếp file ảnh PNG thay vì dùng thư viện */}
      <div className="absolute bottom-1 right-1 xl:bottom-2 xl:right-2 z-10 bg-black/70 p-1 xl:p-1.5 rounded-full border border-[#D4AF37]/50 shadow-[0_0_10px_rgba(0,0,0,1)] flex items-center justify-center">
        <img
          src={skillIconPath}
          alt={`Skill ${value}`}
          className="w-4 h-4 xl:w-5 xl:h-5 object-contain filter drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>

      <div className="absolute inset-0 border-[2px] xl:border-[3px] border-[#D4AF37]/50 mix-blend-overlay rounded-md xl:rounded-lg pointer-events-none z-20"></div>
      <div className="absolute inset-[2px] border border-white/10 rounded-md xl:rounded-lg pointer-events-none z-20"></div>
    </div>
  );
};

export default Card;
