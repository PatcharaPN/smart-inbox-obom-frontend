import { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import SearchBarComponent from "../../components/SearchBar/SearchBarComponent";
import EmployeeCardForm from "../../components/EmployeeCardForm/EmployeeCardForm";
import axios from "axios";
import { useAppDispatch, type RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { fetchEmployeeCards } from "../../components/features/employeeCardSlice";
import { Bounce, toast, ToastContainer } from "react-toastify";
import DeleteEmployeeCardPopup from "../../components/DeleteEmployeeCardPopup/DeleteEmployeeCardPopup";
import { Icon } from "@iconify/react/dist/iconify.js";

type EmployeeCard = {
  _id: string;
  firstName: string;
  nickname: string;
  lastName: string;
  employeeId: string;
  department: string;
  note?: string;
  employeeType: string;
  imagePath: string;
  photo: File[];
  cardType: "horizontal" | "vertical";
};

const HRCardGenerator = () => {
  const dispatch = useAppDispatch();
  const employeeCard = useSelector((state: RootState) => state.employee.cards);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cards, setCards] = useState<EmployeeCard[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCardToDelete, setSelectedCardToDelete] =
    useState<EmployeeCard | null>(null);
  // สร้าง state เก็บค่า orientation ที่เลือกก่อนดาวน์โหลด
  const [downloadOrientation, setDownloadOrientation] = useState<
    "horizontal" | "vertical"
  >("horizontal");

  // useEffect(() => {
  //   const fetchCards = async () => {
  //     try {
  //       const res = await axios.get(
  //         "http://100.127.64.22:3000/employee-card/cards"
  //       );
  //       setCards(res.data.data);
  //     } catch (err) {
  //       console.error("ไม่สามารถโหลดข้อมูลบัตรพนักงานได้", err);
  //     }
  //   };
  //   fetchCards();
  // }, []);

  useEffect(() => {
    dispatch(fetchEmployeeCards());
  }, [dispatch]);

  useEffect(() => {
    if (employeeCard.length > 0) {
      setCards(employeeCard);
    }
  }, [employeeCard]);
  const filteredCards = cards
    .filter((card) => {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        card.employeeId.toLowerCase().includes(lowerSearch) ||
        card.firstName.toLowerCase().includes(lowerSearch) ||
        card.nickname.toLowerCase().includes(lowerSearch)
      );
    })
    .sort((a, b) => {
      const numA = Number(a.employeeId);
      const numB = Number(b.employeeId);
      return numA - numB;
    });

  const handleDownload = async (card: EmployeeCard) => {
    console.log(card);

    try {
      const generateEmployeeCardById = await axios.get(
        `http://100.127.64.22:3000/employee-card/generate-pdf/${card._id}?orientation=${downloadOrientation}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([generateEmployeeCardById.data], {
        type: "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${card.employeeId}-${card.firstName}(${card.nickname})-${downloadOrientation}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading card:", error);
    }
  };

  const handleDelete = async (cardId: string) => {
    try {
      await axios.delete(
        `http://100.127.64.22:3000/employee-card/delete/${cardId}`
      );
      dispatch(fetchEmployeeCards());
      toast.success("🗑️ ลบบัตรพนักงานสำเร็จ!", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "light",
        transition: Bounce,
      });
      setCards((prev) => prev.filter((card) => card._id !== cardId));
    } catch (err) {
      console.error("ลบไม่สำเร็จ:", err);
      toast.error("เกิดข้อผิดพลาดในการลบข้อมูล", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="p-10">
      <Modal>
        <div className="w-[70vw] 2xl:w-[77vw] h-[85vh]">
          <div className="grid 2xl:grid-rows-[200px_auto] grid-rows-[240px_auto] h-full">
            <div className="border-b border-black/20 w-full">
              <p className="p-5 text-3xl">จัดการบัตรพนักงาน</p>
              <div className="flex items-center justify-between gap-5 p-5">
                <SearchBarComponent
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />{" "}
                <select className="w-fit my-5 bg-white rounded-full pl-2 pr-4 py-2 focus:ring-[#0065AD] focus:border-[#0065AD] focus:outline-none shadow border border-[#0065AD]">
                  <option value="all">ทั้งหมด</option>
                  <option value="Design">Design</option>
                  <option value="PM/BK">PM/BK</option>
                  <option value="QC">QC</option>
                  <option value="Planning">Planning</option>
                  <option value="Purchase">Purchase</option>
                  <option value="Sale Support">Sale Support</option>
                  <option value="Account">Account</option>
                  <option value="CG">CG</option>
                  <option value="AS">AS</option>
                  <option value="FG">FG</option>
                  <option value="qa">QA</option>
                  <option value="HR">HR</option>
                </select>
                <button
                  onClick={() => setIsModalOpen(!isModalOpen)}
                  className="cursor-pointer bg-[#00B8A9] w-50 text-white px-4 py-2 rounded-full hover:bg-[#008C8D] transition-colors"
                >
                  สร้างบัตรพนักงานใหม่
                </button>
              </div>
            </div>{" "}
            <div className="p-5 flex items-center mb-4 gap-4 sticky top-0 bg-white z-10 border-b border-gray-200">
              {/* Selector เลือกแนวตั้ง/แนวนอน ก่อนดาวน์โหลด */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="orientation"
                  value="horizontal"
                  checked={downloadOrientation === "horizontal"}
                  onChange={() => setDownloadOrientation("horizontal")}
                />
                แนวนอน
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="orientation"
                  value="vertical"
                  checked={downloadOrientation === "vertical"}
                  onChange={() => setDownloadOrientation("vertical")}
                />
                แนวตั้ง
              </label>
            </div>
            <div className="p-5 overflow-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {filteredCards.map((card) => (
                  <div
                    key={card._id}
                    className="relative rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center bg-white p-5 hover:shadow-xl transition-shadow"
                  >
                    <div className="w-full flex justify-end">
                      <Icon
                        icon="akar-icons:edit"
                        className="cursor-pointer opacity-60 hover:scale-102 transition-all duration-200"
                        width="24"
                        height="24"
                      />
                      {/* <button className="flex gap-2 items-center bg-amber-500 p-2 text-sm rounded-lg text-white hover:bg-amber-700 transition-colors cursor-pointer">
                        แก้ไข{" "}
                        <Icon
                          icon="akar-icons:edit"
                          className="opacity-60"
                          width="24"
                          height="24"
                        />
                      </button> */}
                    </div>
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#00B8A9]">
                      <img
                        src={`http://100.127.64.22:3000/${card.imagePath}`}
                        alt="employee"
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="mt-4 text-center">
                      <p className="text-base font-semibold text-gray-800">
                        {card.firstName} {card.lastName} ({card.nickname})
                      </p>
                      <p className="text-sm text-gray-500">{card.department}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        ID: {card.employeeId}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleDownload(card)}
                        className="cursor-pointer flex items-center gap-1 text-sm bg-[#00B8A9] text-white px-4 py-2 rounded-full hover:bg-[#008C8D] transition-colors"
                      >
                        {/* icon download */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
                          />
                        </svg>
                        ดาวน์โหลด
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCardToDelete(card);
                          setIsDeleteModalOpen(true);
                        }}
                        className="cursor-pointer flex items-center gap-1 text-sm bg-red-100 text-red-700 px-4 py-2 rounded-full hover:bg-red-200 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H3.5a.5.5 0 000 1H4v11a2 2 0 002 2h8a2 2 0 002-2V5h.5a.5.5 0 000-1H15V3a1 1 0 00-1-1H6zm2 4a.5.5 0 011 0v8a.5.5 0 01-1 0V6zm4 0a.5.5 0 011 0v8a.5.5 0 01-1 0V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        ลบ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {isDeleteModalOpen && selectedCardToDelete && (
        <DeleteEmployeeCardPopup
          employee={selectedCardToDelete}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={async () => {
            await handleDelete(selectedCardToDelete._id);
            setIsDeleteModalOpen(false);
            setSelectedCardToDelete(null);
          }}
        />
      )}

      {isModalOpen && (
        <EmployeeCardForm onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default HRCardGenerator;
