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
    window.open(`http://localhost:3000/attachments/${attachment.url}`);
  };
  //   const categorizeFileIcon = (type: string) => {};
  return (
    <button onClick={openPreview}>
      <div className="w-80 text-left justify-between  hover:bg-black/25 duration-200 transition h-12 p-1 rounded-sm flex gap-2 items-center cursor-pointer text-[0.8rem] px-2 m-2 border border-blue-950">
        <div className="flex  items-center gap-5">
          {" "}
          <Icon icon="material-icon-theme:pdf" width="20" height="20" />
          <p>{attachment.filename}</p>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            downloadFile(
              `http://localhost:3000/attachments/${attachment.url}`,
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
