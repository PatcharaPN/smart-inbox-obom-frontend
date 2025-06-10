import { motion } from "framer-motion";
import Modal from "../../Modal/Modal";
import DatePickerComponent from "../../DatePickerComponent/DatePickerComponent";
import { useState } from "react";
import { Dayjs } from "dayjs";
import { useUser } from "../../../api/contexts/userContext";
import axiosInstance from "../../../api/axiosInstance";

type IMAPRangePickerProps = {
  onClose: () => void;
};

const folderMap: Record<string, string> = {
  ทั้งหมด: "ALL",
  อินบ็อค: "INBOX",
  ส่งออก: "Sent",
  จดหมายขยะ: "Trash",
  เก็บถาวร: "Archive",
};

const IMAPRangePickerComponent = ({ onClose }: IMAPRangePickerProps) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [selectedFolders, setSelectedFolders] = useState<string[]>(["ALL"]);

  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
      const formattedStart = dates[0]?.format("D-MMM-YYYY");
      const formattedEnd = dates[1]?.format("D-MMM-YYYY");
      console.log("📅 เริ่ม:", formattedStart);
      console.log("📅 สิ้นสุด:", formattedEnd);
    } else {
      setStartDate(null);
      setEndDate(null);
      console.log("📅 ล้างช่วงเวลา");
    }
  };

  const toggleFolder = (label: string) => {
    const value = folderMap[label];

    if (value === "ALL") {
      setSelectedFolders(["ALL"]);
    } else {
      setSelectedFolders((prev) => {
        const isActive = prev.includes(value);
        const newSelection = isActive
          ? prev.filter((f) => f !== value)
          : [...prev.filter((f) => f !== "ALL"), value];
        return newSelection.length > 0 ? newSelection : ["ALL"];
      });
    }
  };
  const handleSubmit = async () => {
    const payload = {
      startDate: startDate?.format("DD-MM-YYYY"), // ✅ ส่งเป็น string ชัดเจน
      endDate: endDate?.format("DD-MM-YYYY"), // ✅ เช่น 2025-06-09
      folders: selectedFolders, // 👈 ส่งเป็น array
    };

    try {
      const response = await axiosInstance.post("/fetch-email", payload);
      console.log("✅ Success:", response.data);
    } catch (error) {
      console.error("❌ Error fetching email:", error);
    }
  };
  return (
    <motion.div
      className="fixed top-0 left-0 w-screen h-screen z-50 bg-black/30 flex justify-center items-center"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <Modal>
          <div className="w-[35vw] h-[50vh] bg-white rounded-xl text-black z-50 max-w-3xl mx-4 flex flex-col">
            <div className="sticky top-0 z-10 bg-white px-6 pt-6 pb-4 border-b border-gray-200 rounded-xl">
              <div className="w-full flex justify-end items-center mb-2">
                <button
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800"
                >
                  X
                </button>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                เลือกช่วงเวลา IMAP
              </h2>
            </div>

            <div className="px-6 mt-4">
              <DatePickerComponent
                startDate={startDate}
                endDate={endDate}
                onChange={handleRangeChange}
              />
            </div>

            <div className="flex-grow p-6">
              <p className="text-gray-600">
                เลือกช่วงเวลาเพื่อกรองข้อมูล IMAP ของคุณ
              </p>
              {startDate && endDate && (
                <p className="mt-4 text-sm text-gray-500">
                  ช่วงเวลา: {startDate.format("D-MMM-YYYY")} ถึง{" "}
                  {endDate.format("D-MMM-YYYY")}
                </p>
              )}

              <div className="flex w-full justify-evenly flex-wrap gap-3 mt-6">
                {Object.keys(folderMap).map((label) => {
                  const isActive = selectedFolders.includes(folderMap[label]);
                  return (
                    <div
                      key={label}
                      className={`cursor-pointer transition-all duration-150 p-3 px-5 border border-black/20 rounded-md ${
                        isActive
                          ? "bg-[#0065AD] text-white"
                          : "hover:bg-[#004170] text-gray-800"
                      }`}
                      onClick={() => toggleFolder(label)}
                    >
                      {label}
                    </div>
                  );
                })}
              </div>
              {/* Debug selected folders */}
              <div className="mt-4 text-xs text-gray-500">
                📁 โฟลเดอร์ที่เลือก: {JSON.stringify(selectedFolders)}
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="cursor-pointer w-full bg-[#0065AD] text-white py-3 rounded-md hover:bg-[#004170] transition duration-200"
            >
              ทำการซิงค์ IMAP
            </button>
          </div>
        </Modal>
      </motion.div>
    </motion.div>
  );
};

export default IMAPRangePickerComponent;
