import axios from "axios";
import Modal from "../../components/Modal/Modal";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

type Entry = {
  name: string;
  type: "file" | "folder";
  path: string;
};

const FilePage = () => {
  const [folder, setFolder] = useState<Entry[]>([]);
  const [currentPath, setCurrentPath] = useState("Uploads");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/list?path=${currentPath}`)
      .then((res) => {
        setFolder(res.data);
      })
      .catch((err) => {
        console.error("Error loading files:", err);
      });
  }, [currentPath]);

  const handleClick = (item: Entry) => {
    if (item.type === "folder") {
      setCurrentPath(`${currentPath}/${item.name}`);
    } else {
      window.open(
        `http://localhost:3000/file?path=${currentPath}/${item.name}`,
        "_blank"
      );
    }
  };

  const goBack = () => {
    const parts = currentPath.split("/");
    if (parts.length > 1) {
      parts.pop();
      setCurrentPath(parts.join("/") || "Uploads");
    }
  };

  const getIcon = (item: Entry) => {
    if (item.type === "folder") return "material-symbols:folder";
    if (item.name.endsWith(".pdf")) return "mdi:file-pdf-box";
    if (item.name.match(/\.(jpg|jpeg|png)$/)) return "mdi:file-image";
    return "material-symbols:description";
  };

  const breadcrumb = currentPath.split("/");

  return (
    <div className="">
      <div className="p-10">
        <div className="grid grid-rows-[0.3fr_1fr] items-center">
          <h1 className="text-3xl">ไฟล์</h1>

          <Modal>
            <div className="h-[67vh] grid grid-rows-[0.1fr_auto] p-5">
              {/* 🔼 Header */}
              <div className="border-b border-b-black flex justify-between items-center h-full">
                <div className="flex gap-2 items-center">
                  <Icon
                    color="#5FA9DD"
                    icon="material-symbols:folder"
                    width="24"
                    height="24"
                  />
                  {/* Breadcrumb */}
                  <div className="flex items-center gap-2">
                    {breadcrumb.map((part, index) => (
                      <span
                        key={index}
                        className="text-sm cursor-pointer"
                        onClick={() =>
                          setCurrentPath(
                            breadcrumb.slice(0, index + 1).join("/")
                          )
                        }
                      >
                        {part}
                        {index < breadcrumb.length - 1 && " / "}
                      </span>
                    ))}
                  </div>
                </div>
                {currentPath !== "Uploads" && (
                  <button
                    onClick={goBack}
                    className="text-blue-500 text-sm underline"
                  >
                    ย้อนกลับ
                  </button>
                )}
              </div>

              {/* 🔽 รายการไฟล์ / โฟลเดอร์ */}
              <div className="overflow-y-auto mt-3 space-y-2">
                {folder.length === 0 ? (
                  <p className="text-gray-500">ไม่พบไฟล์หรือโฟลเดอร์</p>
                ) : (
                  folder.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleClick(item)}
                      className="cursor-pointer hover:bg-gray-100 p-2 rounded flex items-center gap-2"
                    >
                      <Icon
                        icon={getIcon(item)}
                        width="20"
                        height="20"
                        color={item.type === "folder" ? "#5FA9DD" : "#666"}
                      />
                      <span>{item.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default FilePage;
