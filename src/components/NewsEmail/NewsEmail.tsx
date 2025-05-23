// NewsEmail.tsx
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
import { Link } from "react-router-dom";

const NewsEmail = () => {
  const [emails, setEmails] = useState<Array<EmailListProp>>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailListProp | null>(
    null
  );
  const toastIdRef = useRef<string | number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmail, setFilteredEmail] = useState<EmailListProp[]>([]);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState("all");
  const [isOpen, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [years, setYears] = useState<Number[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const limit = 7;

  useEffect(() => {
    setLoading(true);
    axios;
    axios
      .get("http://localhost:3000/emails", {
        params: {
          page,
          limit,
          year: selectedYear,
          search: searchTerm,
          new: true,
        },
      })
      .then((response) => {
        const { data, totalPage, year } = response.data;

        setTimeout(() => {
          setEmails(data);
          setFilteredEmail(data);
          setTotalPage(totalPage);
          setYears(
            year.filter((y: any) => y._id !== null).map((y: any) => y._id)
          );
          setLoading(false);
        }, 1500);
      })
      .catch((err) => {
        setError(err.message || "Error when fetching emails");
        setLoading(false);
      });
  }, [page, selectedYear, searchTerm]);

  const filterEmails = (term: string, year: string) => {
    let result = [...emails];

    if (year !== "all") {
      result = result.filter(
        (email) => new Date(email.date).getFullYear().toString() === year
      );
    }

    if (term.trim() !== "") {
      result = result.filter(
        (email) =>
          email.subject?.toLowerCase().includes(term.toLowerCase()) ||
          email.text?.toLowerCase().includes(term.toLowerCase()) ||
          email.from?.toLowerCase().includes(term.toLowerCase())
      );
    }

    setFilteredEmail(result);
  };
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

  useEffect(() => {
    filterEmails(searchTerm, selectedYear);
  }, [searchTerm, selectedYear]);

  if (error) return <p>Error: {error}</p>;
  return (
    <>
      {" "}
      <div className="flex gap-2 items-center">
        <div className="relative w-[25%] my-5">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <Icon icon="mingcute:search-line" width="20" height="20" />
          </span>
          <input
            type="text"
            className="bg-white rounded-full pl-10 pr-4 py-2 w-full focus:ring-[#0065AD] focus:border-[#0065AD] focus:outline-none shadow border border-[#0065AD]"
            placeholder="ค้นหา.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          onChange={(e) => setSelectedYear(e.target.value)}
          value={selectedYear}
          className="w-fit my-5 bg-white rounded-full pl-2 pr-4 py-2 focus:ring-[#0065AD] focus:border-[#0065AD] focus:outline-none shadow border border-[#0065AD]"
        >
          <option value="all">ทั้งหมด</option>
          {years.map((year) => (
            <option value={year.toString()}>{year.toString()}</option>
          ))}
        </select>
      </div>
      <section className="flex gap-5">
        <Modal>
          <div className={`h-[37vvh] max-h-[37vh] grid grid-rows-3`}>
            <div>
              {loading ? (
                <div className=" flex min-h-[350px] flex-col justify-center items-center ">
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
                      ถึงอีเมล
                    </div>
                    <div className="flex items-center border-r border-gray-300 p-2">
                      ขนาด
                    </div>
                    <div className="flex justify-center items-center p-2">
                      ดำเนินการ
                    </div>
                  </div>
                  <div className="overflow-auto flex-1">
                    {filteredEmail.map((email) => (
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
            <div className="flex justify-end items-center">
              <Link
                to="/Email"
                className="flex items-center gap-2 underline px-5 text-blue-900"
              >
                ดูทั้งหมด
                <Icon icon="ic:round-navigate-next" width="24" height="24" />
              </Link>
            </div>
            {/* Pagination */}
            {/* <div className="sticky flex gap-2 items-center justify-center py-2 bg-white">
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
            </div> */}
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
      />
    </>
  );
};

export default NewsEmail;
