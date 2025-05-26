import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { formatBytes } from "../../hooks/useByteFormat";

export const iconMap: { [key: string]: string } = {
  folder: "fxemoji:folder",
  image: "fluent-color:image-16",
  pdf: "vscode-icons:file-type-pdf2",
  txt: "fluent-color:document-text-16",
  video: "flat-color-icons:video-file",
  default: "flat-color-icons:file",
};

interface NewIconProps {
  file: {
    name: string;
    type: string;
    path: string;
    modified: string;
    size: string;
  };
}

const NewIconListComponent: React.FC<NewIconProps> = ({ file }) => {
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
    <div className="mx-5 px-3 mt-5 w-fit h-15  max-w-[300px] p-2 flex items-center gap-3  border border-black/20 rounded-lg">
      <span className="file-icon">
        <Icon icon={getIcon(file)} width={25} height={25} />
      </span>
      <span className="text-sm">{file.name}</span>
      <span className="text-sm text-black/50">{formatBytes(file.size)}</span>
    </div>
  );
};

export default NewIconListComponent;
