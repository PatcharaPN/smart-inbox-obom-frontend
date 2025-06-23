import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { formatBytes } from "../../hooks/useByteFormat";

// ตัวอย่างของ iconMap ที่แสดงไอคอนตามประเภทไฟล์
export const iconMap: { [key: string]: string } = {
  folder: "streamline-color:new-folder-flat",
  image: "fluent-color:image-16",
  pdf: "vscode-icons:file-type-pdf2",
  txt: "fluent-color:document-text-16",
  video: "flat-color-icons:video-file",
  default: "flat-color-icons:file",
};

interface FileItemProps {
  file: {
    name: string;
    type: string;
    path: string;
    size: string;
    modified: string;
    category: string;
    uploader: string;
  };
}

const BigFileIcon: React.FC<FileItemProps> = ({ file }) => {
  const [isFolderDetailVisible, setFolderDetailVisible] = useState(false);
  const [folderDetailPosition, setFolderDetailPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const getIcon = (file: { name: string; type: string }) => {
    if (file.type === "folder") {
      return iconMap.folder;
    }

    const fileExtension = file.name.split(".").pop();

    switch (fileExtension) {
      case "jpg":
      case "png":
      case "gif":
        return iconMap.image;
      case "pdf":
        return iconMap.pdf;
      case "txt":
        return iconMap.txt;
      case "mp4":
      case "avi":
        return iconMap.video;
      default:
        return iconMap.default;
    }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setFolderDetailPosition({ top: clientY + 10, left: clientX + 10 });
  };
  const formattedTime = (dateInput?: Date | string) => {
    if (!dateInput) return "Invalid time";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "Invalid time";
    return date.toLocaleString("th-TH", {
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  return (
    <div
      onMouseEnter={() => setFolderDetailVisible(true)}
      onMouseLeave={() => setFolderDetailVisible(false)}
      onMouseMove={handleMouseMove}
      className="grid grid-rows-[1fr_0.4fr] gap-1 justify-center flex-col  cursor-pointer transition duration-200 hover:bg-black/10 rounded-xl p-2"
    >
      <span className="file-icon flex justify-center">
        <Icon icon={getIcon(file)} width={90} />
      </span>
      <span className="flex h-10 justify-center w-25 text-center">
        {file.name}
      </span>{" "}
      {isFolderDetailVisible && (
        <div
          className="absolute z-50 bg-white shadow-lg rounded-md p-3 text-sm border border-gray-200 w-40"
          style={{
            top: folderDetailPosition.top,
            left: folderDetailPosition.left,
            position: "fixed",
            pointerEvents: "none",
          }}
        >
          {/* Folder Icon */}
          <div className="w-full flex flex-col items-center justify-center backdrop-blur-2xl ">
            {" "}
            <Icon icon={getIcon(file)} width={90} />
            <p className="py-2 font-semibold">{file.name}</p>
          </div>
          <p className="text-gray-500">ประเภท: {file.type}</p>
          <p className="text-gray-500">
            อัพโหลดโดย: {file.uploader?.length > 0 ? file.uploader : "ระบบ"}
          </p>{" "}
          <p className="text-gray-500">
            แก้ไขล่าสุด: {formattedTime(file.modified)}
          </p>
          <p className="text-gray-500">
            ขนาด: {file.size ? formatBytes(file.size) : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default BigFileIcon;
