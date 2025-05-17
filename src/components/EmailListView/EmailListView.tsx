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
  _id,
  from,
  subject,
  to,
  text,
  attachments,
  date,
  size,
}: EmailListProp) => {
  const formattedDate = (dateInput?: Date | string) => {
    if (!dateInput) return "Invalid date";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "Invalid date"; // ตรวจสอบว่า valid date หรือไม่
    return date.toLocaleDateString("en-GB");
  };
  return (
    <div className="cursor-pointer hover:bg-gray-600/20 transition duration-250 grid grid-cols-[40px_100px_3fr_3fr_1fr_1fr_1fr] md:grid-cols-[40px_100px_3fr_2fr_2fr_1fr_1fr] gap-2 items-center p-2 border-b border-gray-200">
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
      <div className="text-sm text-gray-700 truncate" title={from}>
        {from}
      </div>
      {/* Size */}
      <div className="flex text-sm text-gray-600 text-center whitespace-nowrap">
        {size}
      </div>
      {/* Actions */}
      <div className="flex justify-center items-center gap-2">
        <button className="gap-1 cursor-pointer text-sm rounded-md bg-[#FF3D3D] p-2 flex items-center text-white hover:bg-red-600 transition">
          ลบ
          <Icon icon="material-symbols:delete-outline" width="20" height="20" />
        </button>
        <button className="gap-1 cursor-pointer text-sm rounded-md bg-[#4DC447] p-2 flex items-center text-white hover:bg-green-600 transition">
          ส่งออก
          <Icon icon="uil:export" width="20" height="20" />
        </button>
      </div>
    </div>
  );
};
