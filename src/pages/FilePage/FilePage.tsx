import axios from "axios";
import Modal from "../../components/Modal/Modal";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import FileItem, { iconMap } from "../../components/IconList/IconList";
import StorageIndicator from "../../components/StorageIndicator/StorageIndicator";
import NewFolderComponent from "../../components/NewFolderComponent/NewFolderComponent";
import { formatBytes } from "../../hooks/useByteFormat";
import SearchBarComponent from "../../components/SearchBar/SearchBarComponent";
import { Bounce, toast, ToastContainer } from "react-toastify";
import DeletePopupComponent from "../../components/DeletePopupComponent/DeletePopupComponent";

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
  const [openModal, setOpenModal] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);

  const formattedDate = (dateInput?: Date | string) => {
    if (!dateInput) return "Invalid date";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-GB");
  };
  const formattedTime = (dateInput?: Date | string) => {
    if (!dateInput) return "Invalid time";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "Invalid time";
    return date.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const loadDirectory = (paths: string[]) => {
    axios
      .get("http://localhost:3000/explorer", {
        params: { paths: paths.join(",") },
      })
      .then((res) => {
        setItems(res.data);
        setPath(currentPath);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadDirectory([currentPath]);
  }, [currentPath]);
  const handleClick = (item: Entry) => {
    if (item.type === "folder") {
      setCurrentPath(item.path);
    } else {
      window.open(`http://localhost:3000/${item.path}`, "_blank");
    }
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(
          `http://localhost:3000/upload?targetPath=${encodeURIComponent(
            currentPath
          )}`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        console.log("✅ Uploaded:", data);
      } catch (error) {
        console.error("❌ Upload failed:", error);
      }
    }

    loadDirectory([currentPath]);
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
  const handleDelete = async (item: Entry) => {
    setOpenDeletePopup(true);
    // try {
    //   const res = await fetch(
    //     `http://localhost:3000/delete?path=${encodeURIComponent(item.path)}`,
    //     {
    //       method: "DELETE",
    //     }
    //   );
    //   if (res.ok) {
    //     toast.success("🗑️ ลบสำเร็จ!", {
    //       position: "bottom-right",
    //       autoClose: 5000,
    //       hideProgressBar: false,
    //       closeOnClick: false,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //       transition: Bounce,
    //     });
    //     loadDirectory([currentPath]);
    //   } else {
    //     toast.error("🗑️ ลบไม่สำเร็จ", {
    //       position: "bottom-right",
    //       autoClose: 5000,
    //       hideProgressBar: false,
    //       closeOnClick: false,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //       transition: Bounce,
    //     });
    //   }
    // } catch (error) {
    //   toast.error("An Server error occurred", {
    //     position: "bottom-right",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: false,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "colored",
    //     transition: Bounce,
    //   });
    // }
  };
  return (
    <div className="">
      <div className="p-10">
        <div className="grid grid-rows-[0.3fr_1fr] gap-5 items-center">
          <h1 className="text-3xl">จัดการไฟล์</h1>
          {/* <StorageIndicator /> */}
          <SearchBarComponent
            searchTerm={""}
            setSearchTerm={function (e: string): void {
              throw new Error("Function not implemented.");
            }}
          />
          <Modal>
            {" "}
            <div className="px-5 pt-5">
              <h1 className="text-lg">เพิ่มใหม่ล่าสุด</h1>
            </div>
            <div className="mx-5 mt-5 w-50 p-3 border border-black/20 rounded-lg">
              {" "}
              <div className="grid grid-cols-[40px_1fr_1fr]">
                <p>1</p>
                <p>2</p>
                <p>2</p>
              </div>
            </div>
            <div className="w-full h-0.5 my-6 px-5 bg-black/20"></div>
            <div className="px-5 pt-5 ">
              <div className="w-full flex justify-between">
                <h1 className="text-lg">ไฟล์ทั้งหมด</h1>
                <button className="text-lg bg-[#045893] text-white p-2 flex rounded-lg hover:scale-95 transition-all duration-150 cursor-pointer">
                  อัพโหลดไฟล์
                  <Icon
                    icon="material-symbols:upload-rounded"
                    width="24"
                    height="24"
                  />
                </button>
              </div>
            </div>
            <div className="h-[46vh] grid grid-rows-[0.1fr_0.1fr] p-5">
              {/* 🔼 Header */}
              <div className="flex pb-2 justify-between items-center h-full">
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
                    <div
                      onClick={() => setOpenModal(true)}
                      className="p-2 cursor-pointer "
                    >
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
                <ul className="grid grid-cols-[20px_700px_70px_166px_100px_120px_auto] gap-4 items-center font-medium px-4 py-2 bg-black/10">
                  <li>
                    <input type="checkbox" />
                  </li>
                  <li>ชื่อ</li>
                  <li>ขนาด</li>
                  <li>แก้ไขล่าสุด</li>
                  <li>ชนิด</li>
                  <li>สร้างโดย</li>
                  <li className="text-center">จัดการ</li>
                </ul>
              </div>
              {/* 🔽 รายการไฟล์ / โฟลเดอร์ */}
              <div className="overflow-y-auto mt-3 space-y-2">
                {items.length === 0 ? (
                  <div className="w-full flex justify-center h-full items-center">
                    <p className="text-gray-500">ไม่พบไฟล์หรือโฟลเดอร์</p>
                  </div>
                ) : (
                  items.map((item: Entry) => (
                    <div
                      className="border-b border-b-black/20 grid grid-cols-[20px_700px_70px_166px_100px_120px_auto] gap-4 items-center font-normal px-4 py-2 hover:bg-black/10 transition"
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
                      <div>
                        {item.type === "file" ? (
                          <p>{formatBytes(item.size)}</p>
                        ) : null}
                      </div>
                      <p>{formattedTime(item.modified)}</p>
                      <p>{item.category}</p>
                      <p>Created By</p>
                      {item.type === "file" ? (
                        <div className="flex justify-center items-center gap-2">
                          <button className="gap-1 h-8 cursor-pointer text-[0.7rem] rounded-md bg-[#4DC447] p-2 flex items-center text-white hover:bg-green-600 transition">
                            ดาวน์โหลด
                            <Icon
                              icon="tabler:download"
                              width="24"
                              height="24"
                            />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item);
                            }}
                            className="gap-1 h-8 cursor-pointer text-[0.8rem] rounded-md bg-[#FF3D3D] p-2 flex items-center text-white hover:bg-red-600 transition"
                          >
                            ลบ
                            <Icon
                              icon="material-symbols:delete-outline"
                              width="20"
                              height="20"
                            />
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-dashed border-2 border-gray-400 p-10 text-center"
              >
                ลากไฟล์มาที่นี่เพื่ออัปโหลด
              </div>
            </div>
          </Modal>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
        />
        {openDeletePopup ? (
          <DeletePopupComponent
            onClose={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        ) : null}
      </div>
      {openModal ? (
        <NewFolderComponent onClose={() => setOpenModal(false)} />
      ) : null}
    </div>
  );
};

export default FilePage;
