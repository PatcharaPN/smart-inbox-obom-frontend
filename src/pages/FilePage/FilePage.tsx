import axios from "axios";
import Modal from "../../components/Modal/Modal";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import FileItem, { iconMap } from "../../components/IconList/IconList";

type Entry = {
  name: string;
  type: "file" | "folder";
  path: string;
  size: string;
  modified: string;
  category: string;
};

const FilePage = () => {
  const [path, setPath] = useState("Uploads");
  const [items, setItems] = useState([]);
  const [currentPath, setCurrentPath] = useState("Uploads");

  const formattedDate = (dateInput?: Date | string) => {
    if (!dateInput) return "Invalid date";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-GB");
  };

  const loadDirectory = (currentPath: string) => {
    axios
      .get("http://localhost:3000/explorer", { params: { path: currentPath } })
      .then((res) => {
        setItems(res.data);
        setPath(currentPath);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadDirectory(currentPath);
  }, [currentPath]);
  const handleClick = (item: Entry) => {
    if (item.type === "folder") {
      setCurrentPath(item.path);
    } else {
      window.open(`http://localhost:3000/${item.path}`, "_blank");
    }
  };

  const goBack = () => {
    const parts = currentPath.split("/");
    if (parts.length > 1) {
      parts.pop();
      const newPath = parts.join("/") || "Uploads";
      setCurrentPath(newPath);
    }
  };
  const breadcrumb = path.split("/");

  // const getIcon = (item: Entry) => {
  //   if (item.type === "folder") return "material-symbols:folder";
  //   if (item.name.endsWith(".pdf")) return "mdi:file-pdf-box";
  //   if (item.name.match(/\.(jpg|jpeg|png)$/)) return "mdi:file-image";
  //   return "material-symbols:description";
  // };

  return (
    <div className="">
      <div className="p-10">
        <div className="grid grid-rows-[0.3fr_1fr] items-center">
          <h1 className="text-3xl">ไฟล์</h1>

          <Modal>
            <div className="h-[67vh] grid grid-rows-[0.1fr_0.1fr] p-5">
              {/* 🔼 Header */}
              <div className="border-b border-b-black flex justify-between items-center h-full">
                <div className="flex gap-2 items-center">
                  <Icon
                    color="#5FA9DD"
                    icon="fxemoji:folder"
                    width="24"
                    height="24"
                  />
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
                    ))}{" "}
                    <div className="p-2 cursor-pointer ">
                      <Icon icon="ic:sharp-plus" width="24" height="24" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-5 px-2">
                  <div className="cursor-pointer">
                    <Icon
                      icon="material-symbols:view-cozy-outline"
                      width="24"
                      height="24"
                      color="#045893"
                    />
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
              </div>{" "}
              <div className="h-fit">
                <ul className="grid grid-cols-[20px_700px_170px_100px_165px_auto] gap-4 items-center font-medium px-4 py-2 border-b">
                  <li>
                    <input type="checkbox" />
                  </li>
                  <li>ชื่อ</li>
                  <li>แก้ไขล่าสุด</li>
                  <li>ชนิด</li>
                  <li>สร้างโดย</li>
                  <li className="text-center">จัดการ</li>
                </ul>
              </div>
              {/* 🔽 รายการไฟล์ / โฟลเดอร์ */}
              <div className="overflow-y-auto mt-3 space-y-2">
                {items.length === 0 ? (
                  <p className="text-gray-500">ไม่พบไฟล์หรือโฟลเดอร์</p>
                ) : (
                  items.map((item: Entry) => (
                    <div
                      className="grid grid-cols-[20px_700px_auto_auto_auto_auto_auto] gap-4 items-center font-normal px-4 py-2 hover:bg-black/10 transition"
                      key={item.path}
                      style={{ cursor: "pointer", margin: "5px 0" }}
                      onClick={() => handleClick(item)}
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        name=""
                        id=""
                      />
                      <FileItem file={item} />
                      <p>{formattedDate(item.modified)}</p>
                      <p>{item.category}</p>
                      <p>Created By</p>
                      <div
                        className="flex justify-center w-full items-center"
                        onClick={() => handleClick(item)}
                      >
                        <Icon
                          icon="material-symbols:download-rounded"
                          width="24"
                          height="24"
                        />
                      </div>
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
