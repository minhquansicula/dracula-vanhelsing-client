// src/components/game/RulebookModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RulebookModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("goal");

  if (!isOpen) return null;

  const tabs = [
    { id: "goal", label: "Mục Tiêu & Điều Kiện" },
    { id: "gameplay", label: "Luật Chơi Cốt Lõi" },
    { id: "combat", label: "Phán Xét (Giao Tranh)" },
    { id: "skills", label: "Quyền Năng Lá Bài" },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="relative w-full max-w-5xl h-[85vh] bg-[#0a0f12] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,1)] rounded-sm flex flex-col md:flex-row overflow-hidden"
        >
          {/* Trang trí góc cổ điển */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-game-dracula-orange/30 pointer-events-none m-2" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-game-vanhelsing-blood/30 pointer-events-none m-2" />

          {/* Cột điều hướng (Sidebar) */}
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-white/5 bg-black/40 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(225,85,37,0.05),transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(154,27,31,0.05),transparent_50%)] pointer-events-none" />

            <div className="p-8 pb-4 relative z-10 flex justify-between items-center md:block">
              <h2 className="text-3xl font-black text-white uppercase tracking-widest font-['Playfair_Display'] drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">
                Sách <br className="hidden md:block" />
                <span className="text-game-dracula-orange">Luật Cổ</span>
              </h2>
              <button
                onClick={onClose}
                className="md:hidden text-white/50 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-row md:flex-col gap-2 p-4 md:p-8 overflow-x-auto md:overflow-visible relative z-10 custom-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-left px-4 md:px-6 py-3 uppercase tracking-widest text-xs font-bold transition-all whitespace-nowrap md:whitespace-normal duration-300 ${
                    activeTab === tab.id
                      ? "bg-white/10 text-white border-l-2 border-game-dracula-orange shadow-[inset_10px_0_20px_rgba(225,85,37,0.1)]"
                      : "text-white/40 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cột Nội dung */}
          <div className="w-full md:w-2/3 flex-1 overflow-y-auto p-8 md:p-12 text-game-bone-white/80 leading-relaxed custom-scrollbar relative">
            {/* Nút đóng (Desktop) */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-white/30 hover:text-white hover:rotate-90 transition-all duration-300 hidden md:block outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {activeTab === "goal" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <h3 className="text-2xl font-black text-game-vanhelsing-blood uppercase tracking-widest font-['Playfair_Display']">
                  Mục Tiêu & Điều Kiện Thắng
                </h3>
                <p className="text-sm italic text-white/50 border-l-2 border-white/20 pl-4">
                  "Sương mù bao phủ London. Một kẻ săn lùng sinh mạng, kẻ còn
                  lại săn lùng ác quỷ. Đêm nay, chỉ một người được đón bình
                  minh."
                </p>
                <div className="space-y-6">
                  <div className="bg-game-dracula-orange/5 border border-game-dracula-orange/20 p-6 rounded-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-game-dracula-orange/10 rounded-full blur-2xl -mr-10 -mt-10" />
                    <h4 className="text-game-dracula-orange font-bold uppercase tracking-widest mb-3">
                      Phe Dracula
                    </h4>
                    <p className="text-sm">
                      Bạn là Chúa tể Bóng đêm. Bạn có{" "}
                      <strong>12 HP (Máu)</strong>. Bạn sẽ chiến thắng nếu đạt 1
                      trong 2 điều kiện:
                    </p>
                    <ul className="list-disc list-inside mt-3 text-sm space-y-2 opacity-80">
                      <li>
                        Biến toàn bộ <strong>4 Dân Làng</strong> ở cùng 1 Quận
                        bất kỳ thành Ma Cà Rồng.
                      </li>
                      <li>
                        Sống sót thành công cho đến khi{" "}
                        <strong>kết thúc Vòng đấu thứ 5</strong>.
                      </li>
                    </ul>
                  </div>
                  <div className="bg-game-vanhelsing-blood/5 border border-game-vanhelsing-blood/20 p-6 rounded-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-game-vanhelsing-blood/10 rounded-full blur-2xl -mr-10 -mt-10" />
                    <h4 className="text-game-vanhelsing-blood font-bold uppercase tracking-widest mb-3">
                      Phe Van Helsing
                    </h4>
                    <p className="text-sm">
                      Bạn là Thợ săn dạn dày kinh nghiệm. Bạn không có lượng máu
                      cố định. Mục tiêu duy nhất của bạn:
                    </p>
                    <ul className="list-disc list-inside mt-3 text-sm space-y-2 opacity-80">
                      <li>
                        Rút cạn <strong>12 HP</strong> của Dracula trước khi
                        bình minh của Vòng thứ 5 ló rạng.
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "gameplay" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <h3 className="text-2xl font-black text-white uppercase tracking-widest font-['Playfair_Display']">
                  Luật Chơi Cốt Lõi
                </h3>
                <p className="text-sm">
                  Trò chơi diễn ra tối đa trong 5 vòng. Mỗi người chơi bắt đầu
                  với 5 lá bài úp (tương ứng với 5 Quận). Ở mỗi lượt của mình,
                  bạn <strong>phải</strong> thực hiện chuỗi hành động sau:
                </p>

                <div className="pl-4 border-l border-white/20 space-y-5 text-sm">
                  <div>
                    <strong className="text-white text-base">1. Rút bài</strong>
                    <p className="text-white/60 mt-1">
                      Rút 1 lá bài từ Bộ Bài Chính (Draw Pile).
                    </p>
                  </div>
                  <div>
                    <strong className="text-white text-base">
                      2. Đánh bài
                    </strong>
                    <p className="text-white/60 mt-1 mb-2">
                      Bạn có 2 lựa chọn:
                    </p>
                    <ul className="list-disc list-inside pl-2 text-white/60 space-y-1">
                      <li>
                        <span className="text-white">Vứt thẳng</span> lá vừa rút
                        vào Mộ Bài (Discard Pile).
                      </li>
                      <li>
                        <span className="text-white">Tráo đổi</span> lá vừa rút
                        với 1 trong 5 lá đang nằm trên tay của bạn, sau đó vứt
                        lá bài cũ vừa bị đổi vào Mộ Bài.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-white text-base">
                      3. Kích hoạt Quyền năng
                    </strong>
                    <p className="text-white/60 mt-1">
                      Kỹ năng của lá bài bị vứt vào Mộ Bài sẽ{" "}
                      <span className="text-game-dracula-orange font-bold">
                        bắt buộc được kích hoạt
                      </span>{" "}
                      (dù đó là lá bạn vừa rút hay lá bạn thay từ trên tay
                      xuống).
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 p-6 border border-white/10 rounded-sm mt-6">
                  <h4 className="text-white uppercase tracking-widest mb-2 font-bold text-sm">
                    Kết Thúc Vòng Đấu
                  </h4>
                  <p className="text-xs text-white/60 leading-relaxed mb-3">
                    Vòng đấu sẽ lập tức khép lại và tiến vào pha Giao Tranh nếu
                    xảy ra 1 trong 3 trường hợp:
                  </p>
                  <ul className="list-decimal list-inside text-xs text-white/60 space-y-2">
                    <li>
                      <strong className="text-white">Gọi kết thúc:</strong> Thay
                      vì rút bài, nếu Mộ Bài có từ <strong>6 lá trở lên</strong>
                      , bạn có thể gọi Kết thúc vòng. Đối thủ được đi thêm 1
                      lượt cuối cùng.
                    </li>
                    <li>
                      <strong className="text-white">Hết bài rút:</strong> Khi
                      lá bài cuối cùng của Bộ bài được rút, vòng đấu tự động kết
                      thúc sau lượt đó.
                    </li>
                    <li>
                      <strong className="text-white">Dùng lá số 8:</strong> Đánh
                      lá bài số 8 xuống Mộ bài. Vòng đấu kết thúc ngay lập tức,
                      đối thủ mất luôn lượt đi cuối.
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === "combat" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <h3 className="text-2xl font-black text-game-bone-white uppercase tracking-widest font-['Playfair_Display']">
                  Phán Xét (Giao Tranh)
                </h3>
                <p className="text-sm">
                  Khi vòng đấu kết thúc, Màn đêm buông xuống. Hai bên sẽ lật bài
                  và đọ sức ở từng Quận (District) từ trái sang phải.
                </p>

                <div className="bg-[#11181c] p-6 border border-white/10 rounded-sm shadow-inner relative">
                  <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-game-dracula-orange to-game-vanhelsing-blood opacity-50" />
                  <h4 className="text-white uppercase tracking-widest mb-4 font-bold text-sm border-b border-white/10 pb-2">
                    Thứ Tự Ưu Tiên Thắng Thua
                  </h4>
                  <ol className="list-decimal list-inside space-y-4 text-sm text-white/60">
                    <li>
                      <span className="text-game-dracula-orange font-bold">
                        Chất Bài Chủ (Trump Color):{" "}
                      </span>
                      Màu sắc đang nằm ở{" "}
                      <strong className="text-white">
                        vị trí Cao Nhất (Top 1)
                      </strong>{" "}
                      trên Bảng Xếp Hạng Màu chính là Trump Color. Nếu 1 trong 2
                      lá là Trump Color, lá đó tự động thắng.
                    </li>
                    <li>
                      <span className="text-white font-bold">
                        Đọ Số (Giá trị bài):{" "}
                      </span>
                      Nếu cả 2 lá bài đều là Trump Color, hoặc cả 2 đều KHÔNG
                      phải Trump Color, lá nào có{" "}
                      <strong className="text-white">giá trị số lớn hơn</strong>{" "}
                      sẽ thắng.
                    </li>
                    <li>
                      <span className="text-white font-bold">
                        Đọ Hạng Màu (Kẻ Phá Bĩnh):{" "}
                      </span>
                      Trong trường hợp hiếm hoi 2 lá bài{" "}
                      <strong className="text-white">cùng số</strong>, lá nào có
                      màu nằm ở vị trí cao hơn trên Bảng Xếp Hạng Màu sẽ giành
                      chiến thắng.
                    </li>
                  </ol>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 bg-game-dracula-orange/10 p-4 border border-game-dracula-orange/20 text-center rounded-sm transition-transform hover:scale-105">
                    <p className="text-[10px] uppercase tracking-widest text-game-dracula-orange font-bold mb-2">
                      Dracula Thắng Quận
                    </p>
                    <p className="text-xs">
                      Cắn cổ 1 Dân Làng. Khu vực đó thêm 1 Token Ma Cà Rồng.
                    </p>
                  </div>
                  <div className="flex-1 bg-game-vanhelsing-blood/10 p-4 border border-game-vanhelsing-blood/20 text-center rounded-sm transition-transform hover:scale-105">
                    <p className="text-[10px] uppercase tracking-widest text-game-vanhelsing-blood font-bold mb-2">
                      Van Helsing Thắng
                    </p>
                    <p className="text-xs">
                      Chém trúng ác quỷ. Tiêu hao 1 HP của Lãnh chúa Dracula.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "skills" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                  <h3 className="text-2xl font-black text-white uppercase tracking-widest font-['Playfair_Display']">
                    Quyền Năng Lá Bài
                  </h3>
                  <span className="text-xs text-white/40 uppercase tracking-widest">
                    Hiệu ứng bắt buộc
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      val: 1,
                      name: "Nhãn Lực",
                      text: "Lật lộ diện 1 lá bài đang úp của bản thân. Lá bài này vẫn giữ nguyên vị trí.",
                    },
                    {
                      val: 2,
                      name: "Tiên Tri",
                      text: "Lật lộ diện lá bài nằm trên cùng của Bộ Bài Rút. Mọi người đều thấy lá bài tiếp theo là gì.",
                    },
                    {
                      val: 3,
                      name: "Dõi Theo",
                      text: "Bắt buộc đối thủ phải lật lộ diện 1 lá bài đang úp của họ.",
                    },
                    {
                      val: 4,
                      name: "Tráo Đổi",
                      text: "Bí mật hoán đổi vị trí 2 lá bài đang nằm trên tay bạn.",
                    },
                    {
                      val: 5,
                      name: "Huyết Lực",
                      text: "Nhận thêm 1 lượt đi. Bạn lập tức rút và đánh bài thêm một lần nữa.",
                    },
                    {
                      val: 6,
                      name: "Đánh Cắp",
                      text: "Đổi 1 lá bài của bạn với đối thủ ở cùng vị trí Quận. Cả 2 lá bài sẽ giữ nguyên trạng thái úp/ngửa.",
                    },
                    {
                      val: 7,
                      name: "Thao Túng",
                      text: "Bắt buộc: Đổi vị trí màu Chủ Đạo (Top 1) với một màu khác trên Bảng Xếp Hạng Màu.",
                    },
                    {
                      val: 8,
                      name: "Tử Thần",
                      text: "Ép buộc Kết Thúc Vòng ngay lập tức. Đối thủ sẽ KHÔNG có lượt đi cuối cùng. (Chỉ được dùng nếu Mộ bài có tối thiểu 6 lá).",
                    },
                  ].map((skill) => (
                    <div
                      key={skill.val}
                      className="flex gap-4 bg-white/5 border border-white/10 p-4 hover:border-white/30 transition-all group"
                    >
                      <div className="w-12 h-12 shrink-0 bg-[#0a0f12] border border-white/20 flex flex-col items-center justify-center font-['Playfair_Display'] group-hover:border-game-dracula-orange transition-colors shadow-inner">
                        <span className="text-xl font-black text-white group-hover:text-game-dracula-orange">
                          {skill.val}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h5 className="text-xs font-bold uppercase tracking-widest text-game-dracula-orange mb-1">
                          {skill.name}
                        </h5>
                        <p className="text-xs text-white/60 leading-relaxed">
                          {skill.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RulebookModal;
