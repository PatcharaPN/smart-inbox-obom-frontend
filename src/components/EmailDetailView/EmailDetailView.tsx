import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import AttachmentsFileList from "../AttachmentsFileList/AttachmentsFileList";
import DOMPurify from "dompurify";

export interface EmailAttachment {
  filename: string;
  contentType: string;
  contentDisposition: string;
  url: string;
}
export interface DetailModalProps {
  _id?: string;
  from?: string;
  subject?: string;
  text?: string;
  date?: Date;
  cc?: string;
  bb?: string;
  size?: string;
  html?: string;
  to?: string;
  attachment: EmailAttachment[];
  isOpen: boolean;
  onClose: () => void;
}

const EmailDetailModal = ({
  _id,
  bb,
  from,
  subject,
  text,
  date,
  size,
  html,
  cc,
  to,
  isOpen,
  attachment,
  onClose,
}: DetailModalProps) => {
  const prefixIcon = (name: string) => name.toUpperCase().charAt(0);

  const formatDate = (d?: Date) =>
    d
      ? new Date(d).toLocaleString("th-TH", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "-";

  const cleaned = text?.replace(/^>+/gm, (match) => " ".repeat(match.length));

  const formatBytes = (byte: string | number, decimals = 2) => {
    let byteNum = typeof byte === "string" ? parseInt(byte, 10) : byte;
    if (isNaN(byteNum) || byteNum === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;

    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    const i = Math.floor(Math.log(byteNum) / Math.log(k));
    const result = parseFloat((byteNum / Math.pow(k, i)).toFixed(dm));

    return `${result} ${sizes[i]}`;
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {/* พื้นหลังมืด */}
          <motion.div
            className="fixed inset-0 bg-black/30"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          />

          {/* กล่อง modal */}
          <motion.div
            className="h-[85vh] relative bg-white rounded-xl text-black z-50 shadow-lg w-full max-w-3xl mx-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 25, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 25, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {/* Header Sticky */}
            <div className="sticky top-0 z-10 bg-white px-6 pt-6 pb-4 border-b border-gray-200 rounded-xl">
              <div className="w-full flex justify-end items-center mb-2">
                <Icon
                  onClick={onClose}
                  icon="ic:round-close"
                  className="cursor-pointer"
                  width="24"
                  height="24"
                />
              </div>

              <div className="flex gap-4 items-center">
                <div className="flex">
                  <div className="w-16 h-16 rounded-full bg-[#0065AD] border-2 flex justify-center items-center">
                    {" "}
                    <p className="text-3xl text-white font-bold">
                      {prefixIcon(from ?? "")}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="text-lg font-semibold text-gray-800">
                    {subject}
                  </p>
                  <p className="text-sm text-gray-600">จาก: {from}</p>
                  <p className="text-sm text-gray-600">
                    วันที่: {formatDate(date)}
                  </p>
                </div>
              </div>
              <div className="h-40 overflow-y-auto overflow-x-hidden py-2 flex flex-wrap gap-3">
                {attachment.map((file, index) => (
                  <AttachmentsFileList key={index} attachment={file} />
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-auto px-6 py-4">
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  <strong>ถึง:</strong> {to ?? "-"}
                </p>
                {cc && (
                  <p>
                    <strong>สำเนา (CC):</strong> {cc}
                  </p>
                )}
                {bb && (
                  <p>
                    <strong>สำเนาลับ (BCC):</strong> {bb}
                  </p>
                )}
                {size && (
                  <p>
                    <strong>ขนาด:</strong> {formatBytes(size)}
                  </p>
                )}
              </div>

              {/* เนื้อหาอีเมล */}
              {text && (
                <div className="mt-6 overflow-x-hidden">
                  <h3 className="font-semibold text-gray-800 mb-2">เนื้อหา</h3>
                  <div>
                    <div
                      className="email-body"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(html || ""),
                      }}
                    />
                  </div>

                  {/* <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {cleaned}
                  </p> */}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmailDetailModal;
