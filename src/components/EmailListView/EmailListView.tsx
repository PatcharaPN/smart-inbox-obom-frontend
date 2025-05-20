import { Icon } from "@iconify/react/dist/iconify.js";
import type { EmailAttachment } from "../EmailDetailView/EmailDetailView";

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
  const formattedDate = (dateInput?: Date | string) => {
    if (!dateInput) return "Invalid date";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "Invalid date"; // ตรวจสอบว่า valid date หรือไม่
    return date.toLocaleDateString("en-GB");
  };
  const formatBytes = (bytes: string | number, decimals = 2): string => {
    let byteNum = typeof bytes === "string" ? parseInt(bytes, 10) : bytes;
    if (isNaN(byteNum) || byteNum === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    const i = Math.floor(Math.log(byteNum) / Math.log(k));
    const result = parseFloat((byteNum / Math.pow(k, i)).toFixed(dm));

    return `${result} ${sizes[i]}`;
  };

  const getUserInitials = (name: string) => {
    if (!name || name.length < 2) return name;
    const prefix = name.slice(0, 1);
    const suffix = name.slice(-1);
    return prefix + suffix;
  };

  return (
    <div className="cursor-pointer hover:bg-gray-600/20 transition duration-250 grid grid-cols-[40px_100px_3fr_3fr_1fr_1fr_1fr] md:grid-cols-[40px_100px_3fr_2fr_2fr_1fr_1fr] gap-2 items-center py-1 border-b border-gray-200">
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
      {/* From */}
      <div className="text-sm text-gray-700 truncate" title={from}>
        {to}
      </div>{" "}
      <div className="text-sm text-gray-700 truncate flex" title={from}>
        <div className="flex justify-center items-center gap-2">
          <div className="flex justify-center items-center w-8 h-8  p-1 rounded-full text-[0.6rem] text-white font-bold bg-[#0065AD]">
            {getUserInitials(from.toUpperCase() || "")}
          </div>
          <p>{from}</p>
        </div>{" "}
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
    </div>
  );
};
