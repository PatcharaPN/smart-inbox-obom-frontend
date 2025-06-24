import { Icon } from "@iconify/react/dist/iconify.js";
import type { EmailAttachment } from "../EmailDetailView/EmailDetailView";

const AttachmentsFileList = ({
  attachment,
}: {
  attachment: EmailAttachment;
}) => {
  const downloadFile = async (url: string, filename: string) => {
    const response = await fetch(url);
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    // Clean up
    URL.revokeObjectURL(link.href);
  };
  const openPreview = () => {
    window.open(`${import.meta.env.VITE_BASE_URL}${attachment.url}`);
  };
  const getFileIcon = (contentType: string) => {
    if (
      contentType.startsWith("application/zip") ||
      contentType.startsWith("x-zip-compressed") ||
      contentType.startsWith("application/x-zip")
    ) {
      return "streamline-sharp-color:zip-file-flat";
    }

    if (contentType.startsWith("image/")) {
      return "fluent-color:image-28";
    }

    if (contentType === "application/pdf") {
      return "vscode-icons:file-type-pdf2";
    }

    if (
      contentType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || // .docx
      contentType === "application/msword"
    ) {
      return "vscode-icons:file-type-word";
    }

    if (
      contentType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // .xlsx
      contentType === "application/vnd.ms-excel"
    ) {
      return "vscode-icons:file-type-excel";
    }
    if (
      contentType ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation" || // .pptx
      contentType === "application/vnd.ms-powerpoint"
    ) {
      return "vscode-icons:file-type-powerpoint";
    }
    if (
      contentType === "application/acad" ||
      contentType === "image/vnd.dwg" ||
      contentType === "application/dwg" ||
      contentType === "application/x-dwg"
    ) {
      return "streamline-sharp-color:hand-held-tablet-drawing-flat";
    }
    if (
      contentType === "application/octet-stream" ||
      contentType === "application/sla" || // STL
      contentType === "model/stl" ||
      contentType === "application/vnd.step" ||
      contentType === "application/step" ||
      contentType === "application/x-step" ||
      contentType === "application/iges" ||
      contentType === "model/iges" ||
      contentType === "application/x-solidworks"
    ) {
      return "material-icon-theme:3d"; //3D
    }

    return "flat-color-icons:questions";
  };

  return (
    <button onClick={openPreview} title={attachment.filename}>
      <div className="w-fit text-left justify-between  hover:bg-black/25 duration-200 transition h-12 p-1 rounded-sm flex gap-2 items-center cursor-pointer text-[0.8rem] px-2 m-2 border border-blue-950">
        <div className="flex  items-center gap-5">
          <Icon
            icon={getFileIcon(attachment.contentType)}
            width="24"
            height="24"
          />
          <p>{attachment.filename}</p>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            downloadFile(
              `${import.meta.env.VITE_BASE_URL}${attachment.url}`,
              attachment.filename
            );
          }}
        >
          <Icon icon="line-md:download-outline" width="24" height="24" />
        </div>
      </div>
    </button>
  );
};

export default AttachmentsFileList;
