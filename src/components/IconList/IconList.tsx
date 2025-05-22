import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

// ตัวอย่างของ iconMap ที่แสดงไอคอนตามประเภทไฟล์
export const iconMap: { [key: string]: string } = {
  folder: "fxemoji:folder",
  image: "fluent-color:image-16",
  pdf: "vscode-icons:file-type-pdf2",
  txt: "fluent-color:document-text-16",
  video: "flat-color-icons:video-file",
  default: "flat-color-icons:file",
};

interface FileItemProps {
  file: { name: string; type: string; path: string };
}

const FileItem: React.FC<FileItemProps> = ({ file }) => {
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

  return (
    <div className="flex items-center gap-2">
      <span className="file-icon">
        <Icon icon={getIcon(file)} />
      </span>
      <span>{file.name}</span>
    </div>
  );
};

export default FileItem;
