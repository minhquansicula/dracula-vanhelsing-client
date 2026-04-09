import React, { useState, useEffect } from 'react';

const TurnTimer = ({ currentTurnUserId, myUserId, status }) => {
  const maxTime = 60; // 60 giây hiển thị cho user (Server nới lỏng là 62s)
  const [timeLeft, setTimeLeft] = useState(maxTime);

  // Reset thời gian mỗi khi đổi lượt đi
  useEffect(() => {
    setTimeLeft(maxTime);
  }, [currentTurnUserId]);

  // Bộ đếm lùi
  useEffect(() => {
    // Chỉ chạy thời gian nếu phòng đang ở trạng thái Playing (Giá trị int là 1 hoặc chuỗi "Playing")
    // Note: Tùy cách BE của bạn trả về Enum, nó có thể là 1 hoặc "Playing". Bạn kiểm tra log nhé.
    if (status !== 1 && status !== 'Playing') return; 

    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, status]);

  // Không hiển thị nếu không phải lúc đang đánh bài
  if (status !== 1 && status !== 'Playing') return null;

  const percentage = (timeLeft / maxTime) * 100;
  const isMyTurn = currentTurnUserId === myUserId;
  const isUrgent = timeLeft <= 15;

  return (
    <div className="absolute top-0 left-0 w-full h-1.5 bg-black/50 z-[100] overflow-hidden">
      <div
        className={`h-full transition-all duration-1000 ease-linear ${
          isMyTurn 
            ? isUrgent 
              ? 'bg-game-vanhelsing-blood shadow-[0_0_15px_rgba(154,27,31,1)]' 
              : 'bg-game-dracula-orange shadow-[0_0_10px_rgba(225,85,37,0.8)]'
            : 'bg-white/30'
        }`}
        style={{ width: `${percentage}%` }}
      />
      {isMyTurn && isUrgent && (
        <div className="absolute inset-0 bg-red-500/30 animate-pulse mix-blend-overlay pointer-events-none" />
      )}
    </div>
  );
};

export default TurnTimer;