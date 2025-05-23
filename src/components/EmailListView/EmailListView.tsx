import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { EmailAttachment } from "../EmailDetailView/EmailDetailView";
import { formatBytes } from "../../hooks/useByteFormat";

export interface EmailListProp {
  _id: string;
  from: string;
  subject: string;
  text: string;
  date: Date;
  size: string;
  to: string;
  attachments: EmailAttachment[];
}

export const EmailListView = ({
  from,
  subject,
  to,
  date,
  size,
}: EmailListProp) => {
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 }); // State for popover position

  const formattedDate = (dateInput?: Date | string) => {
    if (!dateInput) return "Invalid date";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-GB");
  };

  const getUserInitials = (name: string) => {
    if (!name || name.length < 2) return name;
    const prefix = name.slice(0, 1);
    const suffix = name.slice(-1);
    return prefix + suffix;
  };

  // Handle mouse move to update the position of the Popover
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setPopoverPosition({ top: clientY + 10, left: clientX + 10 }); // Adjust position to avoid overlap
  };

  return (
    <div
      className="cursor-pointer hover:bg-gray-600/20 transition duration-250 grid grid-cols-[40px_100px_3fr_3fr_1fr_1fr_1fr] md:grid-cols-[40px_100px_3fr_2fr_2fr_1fr_1fr] gap-2 items-center py-1 border-b border-gray-200"
      onMouseEnter={() => setPopoverVisible(true)} // Show popover when mouse enters
      onMouseLeave={() => setPopoverVisible(false)} // Hide popover when mouse leaves
      onMouseMove={handleMouseMove}
    >
      {/* Checkbox */}
      <div className="flex justify-center items-center">
        <input type="checkbox" />
      </div>

      {/* Date */}
      <div className="text-sm text-center text-gray-600 truncate">
        {formattedDate(date)}
      </div>

      {/* Subject */}
      <div className="text-sm text-gray-900 truncate" title={subject}>
        {subject}
      </div>
      <div className="text-sm text-gray-700 truncate flex" title={from}>
        <div className="flex justify-center items-center gap-2">
          <div className="flex justify-center items-center w-5 h-5 p-1 rounded-full text-[0.6rem] text-white font-bold bg-[#0065AD]">
            {getUserInitials(from.toUpperCase() || "")}
          </div>
          <p>{from}</p>
        </div>
      </div>

      {/* From */}
      <div className="text-sm text-gray-700 truncate" title={from}>
        {to}
      </div>

      {/* Size */}
      <div className="flex text-sm text-gray-600 text-center whitespace-nowrap">
        {formatBytes(size)}
      </div>

      {/* Actions */}
      <div className="flex justify-center items-center gap-2">
        <button className="gap-1 h-8 cursor-pointer text-[0.8rem] rounded-md bg-[#FF3D3D] p-2 flex items-center text-white hover:bg-red-600 transition">
          ลบ
          <Icon icon="material-symbols:delete-outline" width="20" height="20" />
        </button>
        <button className="gap-1 h-8 cursor-pointer text-[0.8rem] rounded-md bg-[#4DC447] p-2 flex items-center text-white hover:bg-green-600 transition">
          ส่งออก
          <Icon icon="uil:export" width="20" height="20" />
        </button>
      </div>

      {/* Popover - Positioned dynamically */}
      {isPopoverVisible && (
        <div
          className="absolute z-10 bg-white p-4 shadow-lg rounded-xl mt-2 left-0 top-10 w-72 border border-gray-200"
          style={{
            top: `${popoverPosition.top}px`,
            left: `${popoverPosition.left}px`,
          }}
        >
          <div className="text-sm font-bold flex justify-between">
            <p>รายระเอียด</p>{" "}
            <div className="text-sm text-gray-700 truncate flex" title={from}>
              <div className="flex justify-center items-center gap-2">
                <div className="flex justify-center items-center w-8 h-8 p-1 rounded-full text-[0.6rem] text-white font-bold bg-[#0065AD]">
                  {getUserInitials(from.toUpperCase() || "")}
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-600 mt-2">
            <p>
              <strong className="text-green-600">จาก:</strong> {from}
            </p>
            <p>
              <strong className="text-blue-600">ถึง:</strong> {to}
            </p>
            <p>
              <strong className="text-indigo-600">หัวข้อ:</strong> {subject}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
