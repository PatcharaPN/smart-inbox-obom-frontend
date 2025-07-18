import { Icon } from "@iconify/react/dist/iconify.js";
import Modal from "../Modal/Modal";
import {
  EmailListView,
  type EmailListProp,
} from "../EmailListView/EmailListView";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import EmailDetailModal from "../EmailDetailView/EmailDetailView";
import { Bounce, toast, ToastContainer } from "react-toastify";
import DatePickerComponent from "../DatePickerComponent/DatePickerComponent";
import { Dayjs } from "dayjs";
import SearchBarComponent from "../SearchBar/SearchBarComponent";
import IMAPRangePickerComponent from "../IMAPRangePickerComponent/IMAPRangePickerComponent/IMAPRangePickerComponent";
import axiosInstance from "../../api/axiosInstance";
import NoIMAPComponent from "../NoIMAPComponent/NoIMAPComponent";

const AllEmailsComponent = () => {
  const [emails, setEmails] = useState<Array<EmailListProp>>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailListProp | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [folder, setFolder] = useState("all");
  const [isNoIMAP, setIsNoIMAP] = useState(false);
  const toastIdRef = useRef<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState("all");
  const [isOpen, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [years, setYears] = useState<Number[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [isImapModalOpen, setIsImapModalOpen] = useState(false);
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

  const limit = 11;
  const folders = [
    { value: "INBOX", label: "กล่องจดหมาย" },
    { value: "Sent", label: "จดหมายที่ส่ง" },
    { value: "Spam", label: "จดหมายสแปม" },
    { value: "Trash", label: "จดหมายขยะ" },
    { value: "Drafts", label: "ร่างจดหมาย" },
    { value: "", label: "จดหมายกักเก็บ" },
  ];

  useEffect(() => {
    if (loading) {
      if (!toastIdRef.current) {
        toastIdRef.current = toast.loading("🚀 กำลังโหลดข้อมูล...");
      }
    }

    if (!loading && emails.length > 0 && toastIdRef.current !== null) {
      toast.update(toastIdRef.current, {
        render: "✅ โหลดเสร็จเรียบร้อย!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        draggable: true,
      });
    }

    if (error && toastIdRef.current !== null) {
      toast.update(toastIdRef.current, {
        render: `❌ ${error}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        draggable: true,
      });
    }
  }, [loading, error]);
  let userId = null;
  const user = localStorage.getItem("user");

  if (user) {
    const parseuser = JSON.parse(user);
    userId = parseuser._id;
  } else {
    console.log("No user found in localStorage");
  }
  const fetchData = async () => {
    setLoading(true);
    try {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;

      if (!user || !user._id) {
        setError("User not found or invalid user.");
        setLoading(false);
        return;
      }

      let url = `${import.meta.env.VITE_BASE_URL}`;

      const isFilteringByDate = range[0] && range[1];

      url += isFilteringByDate
        ? `/filter-by-date?page=${page}&limit=${limit}&userId=${userId}`
        : `/emails?page=${page}&limit=${limit}&userId=${userId}`;

      if (selectedYear !== "all") url += `&year=${selectedYear}`;
      if (searchTerm.trim() !== "") url += `&search=${searchTerm}`;
      if (folder !== "all") url += `&folder=${folder}`;

      if (isFilteringByDate) {
        const startDate = range[0]!.format("YYYY-MM-DD");
        const endDate = range[1]!.format("YYYY-MM-DD");
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }

      const res = await axios.get(url);
      const { data, totalPage, year } = res.data;
      setEmails(data);
      setTotalPage(totalPage);
      setYears(year ?? []);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดขณะโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    page,
    selectedYear,
    searchTerm,
    folder,
    range[0]?.valueOf(),
    range[1]?.valueOf(),
  ]);

  if (error) return <p>Error: {error}</p>;

  const handleClear = () => {
    setSearchTerm("");
    setSelectedYear("all");
    setFolder("all");
    setRange([null, null]);
    setPage(1);
    setError(null);
  };

  const payload = {
    folders: ["INBOX", "Sent", "Trash", "Archive"],
  };

  const handleSyncNewsEmail = async () => {
    try {
      const response = await axiosInstance.post("/fetch-new", payload);
      console.log("✅ Success:", response.data);
    } catch (error: any) {
      if (error.response?.data?.message?.includes("IMAP")) {
        setIsNoIMAP(true);
      } else {
        setError("เกิดข้อผิดพลาดขณะดึงข้อมูล");
      }
    }
  };
  const handleRefresh = () => {
    fetchData();
  };

  return (
    <>
      <div className="flex gap-2 items-center w-full">
        {" "}
        <SearchBarComponent
          searchTerm={searchTerm}
          setSearchTerm={(term) => setSearchTerm(term)}
        />
        <select
          onChange={(e) => setSelectedYear(e.target.value)}
          value={selectedYear}
          className="w-fit my-5 bg-white rounded-full pl-2 pr-4 py-2 focus:ring-[#0065AD] focus:border-[#0065AD] focus:outline-none shadow border border-[#0065AD]"
        >
          <option value="all">ทั้งหมด</option>
          {years.map((year, index) => (
            <option key={index} value={year?.toString?.() ?? ""}>
              {year?.toString?.() ?? "ไม่ทราบปี"}
            </option>
          ))}
        </select>{" "}
        <select
          onChange={(e) => setFolder(e.target.value)}
          value={folder}
          className="w-fit my-5 bg-white rounded-full pl-2 pr-4 py-2 focus:ring-[#0065AD] focus:border-[#0065AD] focus:outline-none shadow border border-[#0065AD]"
        >
          <option value="all">ทั้งหมด</option>
          {folders.map((folder, index) => (
            <option key={index} value={folder.value}>
              {folder.label}
            </option>
          ))}
        </select>
        <div
          className="cursor-pointer flex w-fit items-center gap-2 p-2 rounded-full text-white bg-[#045893]/75"
          onClick={handleRefresh}
        >
          <Icon
            icon="material-symbols:refresh-rounded"
            width="24"
            height="24"
          />
          <button className="cursor-pointer w-full text-md">รีเฟรช</button>
        </div>
        <div className="flex w-full justify-end gap-2">
          <button
            onClick={handleSyncNewsEmail}
            className="cursor-pointer bg-[#0065AD] text-white rounded-full px-4 py-2 hover:bg-[#005A8C] transition duration-200"
          >
            ดึงข้อมูลล่าสุด
          </button>{" "}
          <button
            onClick={() => setIsImapModalOpen(true)}
            className="cursor-pointer bg-[#007078] text-white rounded-full px-4 py-2 hover:bg-[#00575D] transition duration-200"
          >
            ดึงข้อมูลเฉพาะวันที่
          </button>
        </div>
      </div>{" "}
      <div className="pb-5">
        <DatePickerComponent
          startDate={range[0]}
          endDate={range[1]}
          clearbtn={handleClear}
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) {
              setRange([dates[0], dates[1]]);
            } else {
              setRange([null, null]);
            }
            setPage(1);
          }}
        />
      </div>
      <section className="flex gap-5">
        <Modal>
          <div className="flex flex-col h-[35vh] 2xl:h-[45vh] w-[65vw] 2xl:w-[75vw]  overflow-y-auto">
            <div>
              {" "}
              {loading ? (
                <div className=" flex min-h-[520px] flex-col justify-center items-center ">
                  {" "}
                  <div className="flex gap-2">
                    <p>กำลังโหลด..</p>
                    <Icon
                      color="#045893"
                      icon="eos-icons:bubble-loading"
                      width="24"
                      height="24"
                    />
                  </div>
                </div>
              ) : emails.length === 0 || loading.valueOf() ? (
                <div className="h-full flex justify-center items-center">
                  <p>ไม่มีอีเมลล์</p>
                </div>
              ) : (
                <div>
                  <div className="sticky w-full bg-white grid grid-cols-[40px_100px_3fr_3fr_1fr_1fr_1fr] md:grid-cols-[40px_100px_3fr_2fr_2fr_1fr_1fr] gap-2 items-center border-b border-gray-200">
                    <div className="flex justify-center  items-center border-r border-gray-300 p-2">
                      <input type="checkbox" />
                    </div>
                    <div className="flex justify-center items-center border-r border-gray-300 p-2">
                      วันที่
                    </div>
                    <div className="flex items-center border-r border-gray-300 p-2">
                      หัวข้อ
                    </div>{" "}
                    <div className="flex items-center border-r border-gray-300 p-2">
                      จาก
                    </div>
                    <div className="flex items-center border-r border-gray-300 p-2">
                      ถึง
                    </div>
                    <div className="flex items-center border-r border-gray-300 p-2">
                      ขนาด
                    </div>
                    <div className="flex justify-center items-center p-2">
                      ดำเนินการ
                    </div>
                  </div>
                  <div className="overflow-auto flex-1">
                    {emails.map((email) => (
                      <div
                        key={email._id}
                        onClick={() => {
                          setSelectedEmail(email);
                          setOpenModal(true);
                        }}
                      >
                        <EmailListView
                          key={email._id}
                          _id={email._id}
                          from={email.from}
                          subject={email.subject}
                          to={email.to}
                          text={email.text}
                          date={email.date}
                          size={email.size}
                          attachments={email.attachments}
                        />
                      </div>
                    ))}
                  </div>
                  {/*  */}
                </div>
              )}
            </div>
          </div>{" "}
          <div className="py-1">
            {/* Pagination */}
            <div className="sticky flex gap-2 items-center justify-center py-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="cursor-pointer hover:bg-black/20 transition duration-150 text-sm px-2 py-1 border rounded disabled:opacity-50"
              >
                ก่อนหน้า
              </button>

              <span className="text-sm">
                หน้า {page} จาก {totalPage}
              </span>

              <button
                disabled={page === totalPage}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPage))}
                className="cursor-pointer hover:bg-black/20 transition duration-150 text-sm px-2 py-1 border rounded disabled:opacity-50"
              >
                ถัดไป
              </button>
            </div>
          </div>
        </Modal>
      </section>
      <EmailDetailModal
        attachment={selectedEmail?.attachments ?? []}
        {...selectedEmail}
        isOpen={isOpen}
        onClose={() => setOpenModal(false)}
      />{" "}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />{" "}
      {isImapModalOpen ? (
        <IMAPRangePickerComponent
          onClose={() => setIsImapModalOpen(false)}
          setIsNoIMAP={setIsNoIMAP}
        />
      ) : null}
      {isNoIMAP ? <NoIMAPComponent onClose={() => setIsNoIMAP(false)} /> : null}
    </>
  );
};

export default AllEmailsComponent;
