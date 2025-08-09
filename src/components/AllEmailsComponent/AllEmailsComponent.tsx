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
import IMAPRangePickerComponent from "../IMAPRangePickerComponent/IMAPRangePickerComponent/IMAPRangePickerComponent";
import axiosInstance from "../../api/axiosInstance";
import NoIMAPComponent from "../NoIMAPComponent/NoIMAPComponent";
import { getUserIdFromStorage } from "../../utils/localstorage";
import { buildEmailFetchUrl } from "../../utils/email";
import EmailFilterBar from "../EmailFilterBar/EmailFilterBar";
import PaginationComponent from "../PaginationComponent/PaginationComponent";
import EmailTableHeader from "../EmailListView/EmailTableHeader";

const AllEmailsComponent = () => {
  // * Data Handler
  const [emails, setEmails] = useState<Array<EmailListProp>>([]);
  const [loading, setLoading] = useState(false);

  // * Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [folder, setFolder] = useState("all");
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

  const toastIdRef = useRef<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // * Pagination
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  // * Modal states
  const [selectedEmail, setSelectedEmail] = useState<EmailListProp | null>(
    null
  );
  const [isOpen, setOpenModal] = useState(false);
  const [isImapModalOpen, setIsImapModalOpen] = useState(false);
  const [isNoIMAP, setIsNoIMAP] = useState(false);

  // * Auxiliary
  const [years, setYears] = useState<Number[]>([]);

  const userId = getUserIdFromStorage();
  const limit = 11;

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

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!userId) {
        setError("User not found or invalid user.");
        setLoading(false);
        return;
      }

      const url = buildEmailFetchUrl({
        baseUrl: import.meta.env.VITE_BASE_URL,
        page,
        limit,
        userId,
        selectedYear,
        searchTerm,
        folder,
        range,
      });

      const res = await axios.get(url);
      const { data, totalPage, year } = res.data;
      setEmails(data);
      setTotalPage(totalPage);
      setYears((year ?? []).filter((y: number | null) => y !== null));
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
      <EmailFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        years={years as number[]}
        folder={folder}
        setFolder={setFolder}
        onRefresh={handleRefresh}
        onSyncNewsEmail={handleSyncNewsEmail}
        onOpenDateModal={() => setIsImapModalOpen(true)}
      />
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
          <div className="flex flex-col h-[35vh] 2xl:h-[35vh] w-[65vw] 2xl:w-[75vw]  overflow-y-auto">
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
                  <EmailTableHeader />
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
          <PaginationComponent
            page={page}
            totalPage={totalPage}
            onPageChange={setPage}
          />
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
