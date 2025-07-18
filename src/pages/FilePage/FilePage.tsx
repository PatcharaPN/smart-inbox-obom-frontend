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

import React from "react";
import { debounce } from "lodash";
import PermissionDeniedComponent from "../../components/PermissionDeniedComponent/PermissionDeniedComponent";
import RenameFolderPopup from "../../components/RenameFolderPopup/RenameFolderPopup";
import BigFileIcon from "../../components/IconList/BigFileIcon";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
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
  const [, setNewsItem] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPath, setCurrentPath] = useState("Uploads");
  const [openModal, setOpenModal] = useState(false);
  const [clickedAZ, setClickedAZ] = useState(true);
  const [isBigView, setIsBigView] = useState(true);

  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [openRenamePopup, setOpenRenamePopup] = useState(false);
  const [hoveredFilePath, setHoveredFilePath] = useState<string | null>(null);
  const [_, setOpenDeletePopup] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Entry | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const navigate = useNavigate();
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
        toast.success("✅ อัปโหลดไฟล์สำเร็จ", {
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
        toast.error("❌ ไม่สามารถอัปโหลดได้", {
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
      day: "2-digit",
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
    axiosInstance
      .get("/explorer", {
        params: { paths: paths.join(",") },
        headers: {
          Authorization: `Bearer ${token}`,
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
      console.log(file.name);
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
        toast.success("✅ อัปโหลดไฟล์สำเร็จ", {
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
        toast.error("❌ ไม่สามารถอัปโหลดได้", {
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
    <div className="overflow-hidden">
      <div className="p-10">
        <div className="gap-5 items-center">
          {/* <StorageIndicator /> */}

          <Modal onBack={() => navigate(-1)}>
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
              className="w-[70vw] 2xl:w-[77vw] h-[85vh] grid grid-rows-1 2xl:grid-rows-1"
            >
              {" "}
              <div className="p-5">
                {" "}
                <h1 className="text-3xl py-10">จัดการไฟล์</h1>
                {/* <div className="lg:hidden 2xl:block px-5 pt-5">
                <h1 className="text-lg">เพิ่มใหม่ล่าสุด</h1>
              </div>
              <div className="lg:hidden 2xl:flex items-center">
                {newsItem.slice(0, 4).map((newItems: Entry, index) => (
                  <NewIconListComponent key={index} file={newItems} />
                ))}

                {newsItem.length > 3 && (
                  <div className="ml-2 text-sm text-gray-600 font-medium">
                    <p> +{newsItem.length - 3}</p>
                  </div>
                )}
              </div> */}
                <div className="hidden w-full h-0.5 my-6 px-5 bg-black/20"></div>
                <div className="px-5 pt-5 ">
                  <div className="w-full flex justify-between items-center  gap-5 fit border-b border-black/20 pb-2">
                    <div className="flex justify-center gap-10 items-center ">
                      <h1 className="text-asdlg w-40">ไฟล์ทั้งหมด</h1>
                      <div className="w-full">
                        {" "}
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
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`max-h-[5vh] h-full p-5 2xl:grid-cols-[1100px_auto] grid grid-cols-[650px_auto] 2xl:max-h-[70vh]`}
                >
                  {/* 🔼 Header */}
                  <div>
                    {" "}
                    {/* <div>
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
                  </div> */}
                    <div className="flex w-full pb-2 justify-between items-center h-fit">
                      <div className="flex w-full gap-2 px-2 justify-between items-center">
                        <div className="flex items-center gap-2">
                          {" "}
                          <Icon
                            color="#5FA9DD"
                            icon="streamline-color:new-folder-flat"
                            width="24"
                            height="24"
                          />
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
                        </div>{" "}
                        <div className="flex justify-between items-center gap-5 px-2"></div>
                        <div className="flex gap-5 items-center">
                          <div
                            onClick={() => setOpenModal(true)}
                            className="px-2 py-1 hover:bg-[#044B98] hover:text-white duration-150 transition text-md cursor-pointer text-[#044B98] flex items-center border rounded-lg border-[#044B98] gap-2"
                          >
                            <Icon
                              className="#044B98"
                              icon="mingcute:new-folder-line"
                              width="24"
                              height="24"
                            />
                            สร้างโฟลเอร์
                          </div>{" "}
                          {/* <ul className="flex items-center gap-5">
                          <li>
                            <Icon
                              color="#044B98"
                              icon="tabler:cut"
                              width="24"
                              height="24"
                            />
                          </li>
                          <li>
                            <Icon
                              icon="mingcute:copy-line"
                              color="#044B98"
                              width="24"
                              height="24"
                            />
                          </li>
                          <li>
                            <Icon
                              className={`${
                                clipboard ? "opacity-100" : "opacity-50"
                              }`}
                              icon="material-symbols:content-paste"
                              color="#044B98"
                              width="24"
                              height="24"
                            />
                          </li>
                        </ul> */}
                          <AnimatePresence mode="wait">
                            {clickedAZ ? (
                              <motion.div
                                key="a-z"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                onClick={() => setClickedAZ(false)}
                                className="cursor-pointer"
                              >
                                <Icon
                                  icon="tabler:sort-a-z"
                                  color="#005A8C"
                                  width="30"
                                  height="30"
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
                                className="cursor-pointer"
                              >
                                <Icon
                                  color="#005A8C"
                                  icon="tabler:sort-z-a"
                                  width="30"
                                  height="30"
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <div
                            onClick={() => setIsBigView((prev) => !prev)}
                            className="cursor-pointer"
                          >
                            <Icon
                              icon="material-symbols:view-cozy-outline"
                              width="24"
                              height="24"
                              color="#045893"
                            />
                          </div>
                          <div>
                            {" "}
                            {currentPath !== "Uploads" && (
                              <button
                                onClick={goBack}
                                className="text-white text-sm flex items-center gap-2 bg-[#044B98] p-2 rounded-lg cursor-pointer"
                              >
                                <Icon
                                  icon="lets-icons:back"
                                  width="24"
                                  height="24"
                                />
                                ย้อนกลับ
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    {isBigView ? null : (
                      <div className="h-fit">
                        <ul
                          className="grid 
      2xl:grid-cols-[20px_300px_80px_166px_100px_120px_auto] 
      xl:grid-cols-[20px_220px_70px_140px_90px_100px_auto]
      lg:grid-cols-[20px_180px_60px_120px_80px_80px_auto]
      grid-cols-[20px_160px_auto] 
      gap-4 items-center font-medium px-4 py-2 bg-black/10 text-sm"
                        >
                          <li>
                            <input type="checkbox" />
                          </li>
                          <li>ชื่อ</li>
                          <li className="hidden lg:block">ขนาด</li>
                          <li className="hidden lg:block">แก้ไขล่าสุด</li>
                          <li className="hidden lg:block">ชนิด</li>
                          <li className="hidden xl:flex justify-center items-center gap-2">
                            <p>สร้างโดย</p>
                          </li>
                          <li className="text-center hidden xl:flex xl:justify-center">
                            จัดการ
                          </li>
                        </ul>
                      </div>
                    )}
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
                      className="relative overflow-y-auto mt-3 space-y-2 h-[45vh]"
                    >
                      {/* <div className="absolute inset-0 flex top-30 items-center justify-center opacity-50 pointer-events-none z-10">
                   {" "} */}
                      <div
                        className={
                          isBigView ? "flex gap-5 flex-wrap" : "flex flex-col"
                        }
                      >
                        {items.length === 0 ? (
                          <div className="w-full flex h-full justify-center items-center">
                            <p className="text-gray-500">
                              ไม่พบไฟล์หรือโฟลเดอร์
                            </p>
                          </div>
                        ) : (
                          items.map((item: Entry) => (
                            <div
                              key={item.path}
                              className={`file-entry ${
                                isBigView
                                  ? "w-36 flex flex-col items-center"
                                  : "w-full"
                              }`}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                setSelectedEntry(item);
                                handleContextMenu(e);
                              }}
                            >
                              <AnimatePresence mode="wait">
                                {isBigView ? (
                                  <>
                                    <motion.div
                                      key="big"
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.95 }}
                                      transition={{ duration: 0.2 }}
                                      className="flex justify-center"
                                      onClick={() => handleClick(item)}
                                      onContextMenu={(e) => {
                                        e.preventDefault();
                                        setSelectedEntry(item);
                                        handleContextMenu(e);
                                      }}
                                    >
                                      <BigFileIcon
                                        hoveredFilePath={hoveredFilePath}
                                        setHoveredFilePath={setHoveredFilePath}
                                        file={item}
                                      />
                                    </motion.div>
                                  </>
                                ) : (
                                  <motion.div
                                    key="list"
                                    initial={{ opacity: 0, y: 0 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="relative file-entry border-b cursor-pointer border-b-black/20 
    grid 
    2xl:grid-cols-[20px_300px_80px_166px_100px_120px_auto] 
    xl:grid-cols-[20px_220px_70px_140px_90px_100px_auto]
    lg:grid-cols-[20px_180px_60px_120px_80px_80px_auto]
    grid-cols-[20px_160px_auto]
    gap-4 items-center font-normal px-4 py-1 hover:bg-black/10 transition"
                                    onClick={() => handleClick(item)}
                                    onContextMenu={(e) => {
                                      e.preventDefault();
                                      setSelectedEntry(item);
                                      handleContextMenu(e);
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      className="w-4 h-4"
                                    />
                                    <div>
                                      <FileItem file={item} />
                                    </div>

                                    <div className="hidden lg:block">
                                      {item.type === "file" && (
                                        <p className="text-sm">
                                          {formatBytes(item.size)}
                                        </p>
                                      )}
                                    </div>

                                    <p className="text-sm opacity-70 hidden lg:block">
                                      {formattedTime(item.modified)}
                                    </p>

                                    <p className="uppercase opacity-50 font-semibold hidden lg:block">
                                      {item.category}
                                    </p>

                                    <div className="hidden xl:flex justify-center items-center gap-2">
                                      <p>{item.uploader}</p>
                                    </div>

                                    <div className="flex justify-center items-center gap-2 xl:flex">
                                      {item.type === "file" && (
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
                                        </button>
                                      )}
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
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  <section className="px-3 border-[#044B98]/20">
                    <p className="py-2 text-2xl">อัปโหลด</p>
                    {/* Drag and drop Section */}
                    <div
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      className=" flex flex-col gap-2 justify-center items-center rounded-2xl border-2 border-[#044B98] border-dotted h-65 bg-[#F0F5FF]"
                    >
                      <Icon
                        className="opacity-60"
                        color="#044B98"
                        icon="ci:cloud-upload"
                        width="80"
                        height="80"
                      />
                      <p className="text-[#044B98] 2xl:text-xl text-sm">
                        ลากไฟล์มาที่นี่เพื่ออัปโหลด
                      </p>
                    </div>
                    <p className="text-2xl py-4 text-center">หรือ</p>

                    <button
                      onClick={handleUploadClick}
                      className="cursor-pointer w-full rounded-xl hover:bg-[#0F1C33] transition duration-150 text-white  text-center p-4 bg-[#2D5399]"
                    >
                      <input
                        type="file"
                        multiple
                        hidden
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      คลิ๊กที่นี่เพื่ออัปโหลดไฟล์
                    </button>
                  </section>
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
                  className="bg-green-600 w-full text-white px-4 py-2 rounded hover:bg-green-700"
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
              </li>{" "}
              <li
                onClick={() => {
                  setDeleteTarget(selectedEntry);
                }}
                className="gap-1 px-4 py-2 flex items-center cursor-pointer  rounded-md bg-[#FF3D3D]  text-white hover:bg-red-600 transition"
              >
                {" "}
                <Icon
                  icon="material-symbols:delete-outline"
                  width="20"
                  height="20"
                />
                ลบ
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
