import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useRef, useState } from "react";
import { formatBytes } from "../../hooks/useByteFormat";

export const iconMap: { [key: string]: string } = {
  folder: "streamline-color:new-folder-flat",
  image: "fluent-color:image-16",
  xlsx: "vscode-icons:file-type-excel2",
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
  hoveredFilePath: string | null;
  setHoveredFilePath: React.Dispatch<React.SetStateAction<string | null>>;
}

const BigFileIcon: React.FC<FileItemProps> = ({
  file,
  hoveredFilePath,
  setHoveredFilePath,
}) => {
  const [folderDetailPosition, setFolderDetailPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startHoverTimer = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredFilePath(file.path);
    }, 1500);
  };

  const handleMouseEnter = () => {
    startHoverTimer();
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredFilePath(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setFolderDetailPosition({ top: clientY + 10, left: clientX + 10 });

    startHoverTimer();
  };
  const getIcon = (file: { name: string; type: string }) => {
    if (file.type === "folder") {
      return iconMap.folder;
    }
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
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
      case "xlsx":
        return iconMap.xlsx;
      case "xlsm":
        return iconMap.xlsx;
      default:
        return iconMap.default;
    }
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

  const isHovered = hoveredFilePath === file.path;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="grid grid-rows-[1fr_0.4fr] gap-1 justify-center flex-col cursor-pointer transition duration-200 hover:bg-black/10 rounded-xl p-2 relative"
    >
      <span className="file-icon flex justify-center 2xl:hidden ">
        <Icon icon={getIcon(file)} width={40} />
      </span>{" "}
      <span className="file-icon 2xl:flex justify-center md:hidden">
        <Icon icon={getIcon(file)} width={90} />
      </span>
      <span className="flex justify-center text-center">{file.name}</span>{" "}
      {isHovered && (
        <div
          className="absolute z-50 bg-white/0 backdrop-blur-2xl shadow-lg rounded-md p-3 text-sm border border-gray-200 w-40 pointer-events-none"
          style={{
            top: folderDetailPosition.top,
            left: folderDetailPosition.left,
            position: "fixed",
          }}
        >
          <div
            className="flex flex-col items-center justify-start text-center
            cursor-pointer transition duration-200 hover:bg-black/10
            rounded-xl p-4 max-w-[9rem]"
          >
            <span className="file-icon flex justify-center mb-2">
              <Icon icon={getIcon(file)} width={60} height={60} />
            </span>
            <span
              className="text-xs break-words line-clamp-2 leading-tight text-center px-1 w-full"
              title={file.name}
            >
              {file.name}
            </span>
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
