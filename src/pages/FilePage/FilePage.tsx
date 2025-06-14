import axios from "axios";
import Modal from "../../components/Modal/Modal";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import FileItem from "../../components/IconList/IconList";
import NewFolderComponent from "../../components/NewFolderComponent/NewFolderComponent";
import { formatBytes } from "../../hooks/useByteFormat";
import SearchBarComponent from "../../components/SearchBar/SearchBarComponent";
import { Bounce, toast, ToastContainer } from "react-toastify";
import DeletePopupComponent from "../../components/DeletePopupComponent/DeletePopupComponent";
import { AnimatePresence, motion } from "framer-motion";
import NewIconListComponent from "../../components/NewIconList/NewIconListComponent";
import React from "react";
import { debounce } from "lodash";
import PermissionDeniedComponent from "../../components/PermissionDeniedComponent/PermissionDeniedComponent";
import RenameFolderPopup from "../../components/RenameFolderPopup/RenameFolderPopup";
type Entry = {
  name: string;
  type: "file" | "folder";
  path: string;
  size: string;
  modified: string;
  category: string;
  uploader: string;
};

type ContextMenuItem = {
  label: string;
  action: () => void;
};
const FilePage = () => {
  const [path, setPath] = useState("Uploads");
  const [items, setItems] = useState<Entry[]>([]);
  const [newsItem, setNewsItem] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPath, setCurrentPath] = useState("Uploads");
  const [openModal, setOpenModal] = useState(false);
  const [clickedAZ, setClickedAZ] = useState(true);
  const [changePOV, setChangePOV] = useState(false);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [openRenamePopup, setOpenRenamePopup] = useState(false);
  const [_, setOpenDeletePopup] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Entry | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [clipboard, setClipboard] = useState<{
    item: Entry;
    action: "copy" | "cut";
  } | null>(null);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    items: ContextMenuItem[];
  } | null>(null);
  const generateNewFilename = (original: string) => {
    const lastDotIndex = original.lastIndexOf(".");
    if (lastDotIndex === -1) {
      return `${original}`;
    }
    const base = original.slice(0, lastDotIndex);
    const ext = original.slice(lastDotIndex);
    return `${base}${ext}`;
  };
  const handleCut = (item: Entry) => {
    setClipboard({ item, action: "cut" });
    toast.info(`เลือกไฟล์ "${item.name}" เพื่อย้าย`);
    setContextMenu(null);
  };
  const handlePaste = async () => {
    if (!clipboard) return;

    const { item, action } = clipboard;
    const newFilename = generateNewFilename(item.name);

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/paste`,
        {
          sourcePath: item.path,
          targetDir: currentPath,
          newFilename,
          action, // ส่ง action ไปด้วย (copy หรือ cut)
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`${action === "copy" ? "คัดลอก" : "ย้าย"}สำเร็จ`);
      setClipboard(null);
      loadDirectory([currentPath]);
    } catch (err) {
      toast.error("❌ วางไฟล์ไม่สำเร็จ");
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();

    // Prevent the menu from going off the screen
    const maxX = window.innerWidth - 200; // Assuming context menu width is 200px
    const maxY = window.innerHeight - 150; // Assuming context menu height is 150px

    const x = Math.min(e.pageX, maxX);
    const y = Math.min(e.pageY, maxY);

    setContextMenu({
      x,
      y,
      items: [],
    });
  };
  const handleCloseMenu = () => setContextMenu(null);

  useEffect(() => {
    const handleClickOutside = () => handleCloseMenu();
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);
  const debouncedSearch = useRef(
    debounce((term: string) => handleSearch(term), 300)
  ).current;
  const token = localStorage.getItem("accessToken");
  // const [closeModal, setCloseModal] = useState(false);
  // const [confirmClick, setConfirmClick] = useState(false);
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BASE_URL
          }/upload?targetPath=${encodeURIComponent(currentPath)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        console.log("✅ Uploaded:", data);
        toast.success("✅ อัพโหลดไฟล์สำเร็จ", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } catch (error) {
        console.error("❌ Upload failed:", error);
        toast.error("❌ ไม่สามารถอัพโหลดได้", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    }
    loadDirectory([currentPath]);
  };
  // const formattedDate = (dateInput?: Date | string) => {
  //   if (!dateInput) return "Invalid date";
  //   const date = new Date(dateInput);
  //   if (isNaN(date.getTime())) return "Invalid date";
  //   return date.toLocaleDateString("en-GB");
  // };
  const formattedTime = (dateInput?: Date | string) => {
    if (!dateInput) return "Invalid time";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "Invalid time";
    return date.toLocaleString("th-TH", {
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  const getLastFileUpload = () => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/recent-files`)
      .then((res) => {
        setNewsItem(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getLastFileUpload();
  }, [items]);
  const loadDirectory = (paths: string[]) => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/explorer`, {
        params: { paths: paths.join(",") },
        headers: {
          Authorization: `Bearer ${token}`, // ใส่ token ตรงนี้
        },
      })
      .then((res) => {
        const sorted = sortItems(res.data, clickedAZ);
        setItems(sorted);
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
      window.open(`${import.meta.env.VITE_BASE_URL}/${item.path}`, "_blank");
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
          `${
            import.meta.env.VITE_BASE_URL
          }/upload?targetPath=${encodeURIComponent(currentPath)}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`, // ใส่ token ตรงนี้
            },
            body: formData,
          }
        );
        const data = await res.json();
        console.log("✅ Uploaded:", data);
        toast.success("✅ อัพโหลดไฟล์สำเร็จ", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } catch (error) {
        console.error("❌ Upload failed:", error);
        toast.error("❌ ไม่สามารถอัพโหลดได้", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
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
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/delete?path=${encodeURIComponent(
          item.path
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        toast.success("🗑️ ลบสำเร็จ!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        loadDirectory([currentPath]);
        setOpenDeletePopup(false);
        setDeleteTarget(null);
      } else {
        setDeleteTarget(item);
        setIsPermissionDenied(true);
        toast.error("🗑️ ลบไม่สำเร็จ", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error("An Server error occurred", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };
  useEffect(() => {
    const sorted = sortItems(items, clickedAZ);
    setItems(sorted);
  }, [clickedAZ]);
  // const filteredItems = items.filter((item: Entry) => {
  //   if (!searchTerm) return true;

  //   const lowerSearchTerm = searchTerm.toLowerCase();

  //   return (
  //     item.name.toLowerCase().includes(lowerSearchTerm) ||
  //     item.type.toLowerCase().includes(lowerSearchTerm) ||
  //     item.category.toLowerCase().includes(lowerSearchTerm) ||
  //     item.modified.toLowerCase().includes(lowerSearchTerm) ||
  //     formatBytes(item.size).toLowerCase().includes(lowerSearchTerm)
  //   );
  // });

  const handleSearch = async (term: string) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/search`, {
        params: { query: term },
      });
      const sorted = sortItems(res.data, clickedAZ);
      setItems(sorted);
    } catch (error) {
      console.error("❌ Search error:", error);
      toast.error("เกิดข้อผิดพลาดในการค้นหา");
    }
  };
  const sortItems = (items: Entry[], isAZ: boolean) => {
    return [...items].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return isAZ ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  };
  const ToggleViewPoint = () => {
    setChangePOV(!changePOV);
  };
  const downloadFile = async (filePath: string, filename: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/file?path=${encodeURIComponent(
          filePath
        )}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("❌ Download error:", error);
      toast.error("❌ ไม่สามารถดาวน์โหลดไฟล์ได้");
    }
  };

  return (
    <div className="overflow-x-hidden">
      <div className="p-10">
        <div className="gap-5 items-center">
          <h1 className="text-3xl py-10">จัดการไฟล์</h1>
          {/* <StorageIndicator /> */}

          <Modal>
            <div
              onContextMenu={(e) => {
                const isOnFile = (e.target as HTMLElement).closest(
                  ".file-entry"
                );
                if (!isOnFile) {
                  e.preventDefault();
                  setSelectedEntry(null); // คลิกขวาพื้นหลัง
                  handleContextMenu(e);
                }
              }}
              className={`w-[78vw]  grid grid-rows-3`}
            >
              {" "}
              <div className="px-5 pt-5">
                <h1 className="text-lg">เพิ่มใหม่ล่าสุด</h1>
              </div>
              <div className="flex items-center">
                {newsItem.slice(0, 4).map((newItems: Entry, index) => (
                  <NewIconListComponent key={index} file={newItems} />
                ))}

                {newsItem.length > 3 && (
                  <div className="ml-2 text-sm text-gray-600 font-medium">
                    <p> +{newsItem.length - 3}</p>
                  </div>
                )}
              </div>
              <div className="w-full h-0.5 my-6 px-5 bg-black/20"></div>
              <div className="px-5 pt-5 ">
                <div className="w-full flex justify-between items-center  gap-5 fit border-b border-black/20 pb-2">
                  <div className="flex justify-center gap-10 items-center ">
                    <h1 className="text-asdlg w-40">ไฟล์ทั้งหมด</h1>

                    <SearchBarComponent
                      searchTerm={searchTerm}
                      setSearchTerm={(term) => {
                        setSearchTerm(term);
                        if (term.trim() !== "") {
                          debouncedSearch(term);
                        } else {
                          loadDirectory([currentPath]);
                        }
                      }}
                    />
                    <AnimatePresence mode="wait">
                      {clickedAZ ? (
                        <motion.div
                          key="a-z"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          onClick={() => setClickedAZ(false)}
                        >
                          <Icon
                            icon="tabler:sort-a-z"
                            color="#005A8C"
                            width="40"
                            height="40"
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="z-a"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          onClick={() => setClickedAZ(true)}
                        >
                          <Icon
                            color="#005A8C"
                            icon="tabler:sort-z-a"
                            width="40"
                            height="40"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <button
                      onClick={handleUploadClick}
                      className="text-lg bg-[#045893] text-white p-2 flex rounded-lg hover:scale-95 transition-all duration-150 cursor-pointer"
                    >
                      อัพโหลดไฟล์
                      <Icon
                        icon="material-symbols:upload-rounded"
                        width="24"
                        height="24"
                      />
                    </button>
                    <input
                      type="file"
                      multiple
                      hidden
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
              <div className="h-full max-h-[40vh] grid grid-rows-[0.1fr_0.1fr] p-5">
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
                    <div
                      onClick={() => ToggleViewPoint()}
                      className="cursor-pointer"
                    >
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
                  <ul className="grid grid-cols-[20px_600px_80px_166px_100px_120px_auto] gap-4 items-center font-medium px-4 py-2 bg-black/10">
                    <li>
                      <input type="checkbox" />
                    </li>
                    <li>ชื่อ</li>
                    <li>ขนาด</li>
                    <li>แก้ไขล่าสุด</li>
                    <li>ชนิด</li>
                    <div className="flex justify-center items-center gap-2">
                      <p>สร้างโดย</p>
                    </div>
                    <li className="text-center">จัดการ</li>
                  </ul>
                </div>{" "}
                <div
                  onContextMenu={(e) => {
                    e.preventDefault();

                    const target = e.target as HTMLElement;

                    if (!target.closest(".file-entry")) {
                      handleContextMenu(e);
                    }
                  }}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="overflow-y-auto mt-3 space-y-2 h-[28vh]"
                >
                  {items.length === 0 ? (
                    <div className="w-full flex h-full justify-center  items-center">
                      <p className="text-gray-500">ไม่พบไฟล์หรือโฟลเดอร์</p>
                    </div>
                  ) : (
                    items.map((item: Entry) => (
                      <div key={item.path}>
                        <div
                          className="file-entry border-b cursor-pointer border-b-black/20 grid grid-cols-[20px_600px_80px_166px_100px_120px_auto] gap-4 items-center font-normal px-4 py-1 hover:bg-black/10 transition"
                          style={{ cursor: "pointer", margin: "5px 0" }}
                          onContextMenu={(e) => {
                            e.preventDefault();

                            setSelectedEntry(item);
                            handleContextMenu(e);
                          }}
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            name=""
                            id=""
                          />
                          <div onClick={() => handleClick(item)}>
                            <FileItem file={item} />
                          </div>
                          <div>
                            {item.type === "file" ? (
                              <p>{formatBytes(item.size)}</p>
                            ) : null}
                          </div>
                          <p className="text-sm opacity-70">
                            {formattedTime(item.modified)}
                          </p>
                          <p className="uppercase opacity-50 font-semibold">
                            {item.category}
                          </p>
                          <div className="flex justify-center items-center gap-2">
                            <p>{item.uploader}</p>
                          </div>
                          {item.type === "file" ? (
                            <div className="flex justify-center items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadFile(item.path, item.name);
                                }}
                                className="gap-1 h-8 cursor-pointer text-[0.7rem] rounded-md bg-[#4DC447] p-2 flex items-center text-white hover:bg-green-600 transition"
                              >
                                ดาวน์โหลด
                                <Icon
                                  icon="tabler:download"
                                  width="24"
                                  height="24"
                                />
                              </button>{" "}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteTarget(item);
                                }}
                                className="gap-1 h-8 cursor-pointer text-[0.8rem]  rounded-md bg-[#FF3D3D] p-2 flex items-center text-white hover:bg-red-600 transition"
                              >
                                ลบ
                                <Icon
                                  icon="material-symbols:delete-outline"
                                  width="20"
                                  height="20"
                                />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-center items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteTarget(item);
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
                          )}{" "}
                        </div>
                      </div>
                    ))
                  )}
                </div>{" "}
                <AnimatePresence>
                  {deleteTarget && !isPermissionDenied && (
                    <DeletePopupComponent
                      onCancel={() => setDeleteTarget(null)}
                      fileName={deleteTarget.name}
                      onClose={() => setDeleteTarget(null)}
                      onConfirm={() => {
                        if (deleteTarget) {
                          handleDelete(deleteTarget);
                        }
                      }}
                    />
                  )}

                  {deleteTarget && isPermissionDenied && (
                    <PermissionDeniedComponent
                      onCancel={() => {
                        setDeleteTarget(null);
                        setIsPermissionDenied(false);
                      }}
                      fileName={deleteTarget.name}
                      onClose={() => {
                        setDeleteTarget(null);
                        setIsPermissionDenied(false);
                      }}
                      onConfirm={() => {
                        setDeleteTarget(null);
                        setIsPermissionDenied(false);
                      }}
                    />
                  )}
                  {openRenamePopup && (
                    <RenameFolderPopup
                      currentPath={selectedEntry?.path || ""}
                      onSuccess={() => {
                        loadDirectory([currentPath]);
                        setOpenRenamePopup(false);
                      }}
                      onClose={() => setOpenRenamePopup(false)}
                    />
                  )}
                  {/* Context Menu */}
                </AnimatePresence>
                {/* <div className="border-dashed border-2 h-[2vh] border-gray-400 p-10 text-center flex justify-center items-center">
                  <p> ลากไฟล์มาที่นี่เพื่ออัปโหลด</p>
                </div> */}
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
      </div>

      {openModal ? (
        <NewFolderComponent
          currentPath={currentPath}
          onSuccess={() => {
            loadDirectory([currentPath]);
            setOpenModal(false);
          }}
          onClose={() => setOpenModal(false)}
        />
      ) : null}
      {contextMenu && (
        <motion.ul
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.05, ease: "easeOut" }}
          className="absolute bg-white shadow-lg rounded-md text-sm z-50 w-40"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
        >
          {selectedEntry ? (
            <>
              <li
                onClick={() => setOpenRenamePopup(!openRenamePopup)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <Icon
                  icon={"ic:outline-drive-file-rename-outline"}
                  width="24"
                  height="24"
                />{" "}
                เปลี่ยนชื่อ
              </li>
              <li
                onClick={() =>
                  setClipboard({
                    item: selectedEntry,
                    action: "copy",
                  })
                }
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <Icon icon="mingcute:copy-line" width="24" height="24" />
                คัดลอก
              </li>
              {clipboard && (
                <button
                  onClick={handlePaste}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  วางไฟล์ที่นี่ (
                  {clipboard.action === "copy" ? "คัดลอก" : "ย้าย"})
                </button>
              )}
              <li
                onClick={() => handleCut(selectedEntry)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <Icon icon="tdesign:cut" width="24" height="24" />
                ตัด
              </li>
              <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <Icon
                  icon="material-symbols:info-outline"
                  width="24"
                  height="24"
                />
                รายระเอียด
              </li>
            </>
          ) : clipboard ? (
            <li
              onClick={handlePaste}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer text-center"
            >
              วางไฟล์ที่นี่ ({clipboard.action === "copy" ? "คัดลอก" : "ย้าย"})
            </li>
          ) : (
            <li className="px-4 py-2 text-gray-400">ไม่มีไฟล์ที่เลือก</li>
          )}
        </motion.ul>
      )}
    </div>
  );
};

export default FilePage;
