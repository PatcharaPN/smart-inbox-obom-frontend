import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type VersionInfo = {
  version: string;
  changes: string[];
};

const CURRENT_VERSION = "2024.06.10"; // หรือใช้ import.meta.env.VITE_APP_VERSION
const STORAGE_KEY = "last-notified-version";

export default function UpdateNotifier() {
  const [updateInfo, setUpdateInfo] = useState<VersionInfo | null>(null);

  useEffect(() => {
    fetch("/version.json", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: VersionInfo) => {
        const lastShownVersion = localStorage.getItem(STORAGE_KEY);

        if (
          data.version !== CURRENT_VERSION &&
          data.version !== lastShownVersion
        ) {
          setUpdateInfo(data);
        }
      });
  }, []);

  const handleReload = () => {
    if (updateInfo?.version) {
      localStorage.setItem(STORAGE_KEY, updateInfo.version);
    }
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {updateInfo && (
        <>
          {/* 🔲 Background Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/30 bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 📦 Centered Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center mb-2">
                <span className="text-blue-600 text-xl mr-2">🔔</span>
                <p className="font-semibold text-lg text-gray-800">
                  เวอร์ชันใหม่พร้อมใช้งาน!
                </p>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                อัปเดตล่าสุด: <strong>{updateInfo.version}</strong>
              </p>

              <ul className="text-sm text-gray-700 list-disc ml-5 space-y-1 mb-4 max-h-[200px] overflow-y-auto">
                {updateInfo.changes.map((change, i) => (
                  <li key={i}>{change}</li>
                ))}
              </ul>

              <div className="text-right">
                <button
                  onClick={handleReload}
                  className="cursor-pointer inline-flex items-center gap-1 bg-[#0065AD] hover:bg-[#004B81] text-white text-sm px-4 py-2 rounded-lg transition"
                >
                  🔄 รีโหลดแอป
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
