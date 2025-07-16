import { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import SearchBarComponent from "../../components/SearchBar/SearchBarComponent";
import EmployeeCardForm from "../../components/EmployeeCardForm/EmployeeCardForm";
import axios from "axios";

type EmployeeCard = {
  _id: string;
  employeeId: string;
  nickname: string;
  firstName: string;
  cardType: "horizontal" | "vertical";
};

const HRCardGenerator = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cards, setCards] = useState<EmployeeCard[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await axios.get(
          "http://100.127.64.22:3000/employee-card/cards"
        );
        setCards(res.data.data);
      } catch (err) {
        console.error("ไม่สามารถโหลดข้อมูลบัตรพนักงานได้", err);
      }
    };
    fetchCards();
  }, []);
  const filteredCards = cards.filter((card) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      card.employeeId.toLowerCase().includes(lowerSearch) ||
      card.firstName.toLowerCase().includes(lowerSearch) ||
      card.nickname.toLowerCase().includes(lowerSearch)
    );
  });
  return (
    <div className="p-10">
      <Modal>
        <div className="w-[70vw] 2xl:w-[77vw] h-[85vh]">
          <div className="grid 2xl:grid-rows-[200px_auto] grid-rows-[240px_auto] h-full">
            <div className="border-b border-black/20 w-full">
              <p className="p-5 text-3xl">จัดการบัตรพนักงาน</p>
              <div className="flex items-center justify-between gap-5 p-5">
                {" "}
                <SearchBarComponent
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
                <button
                  onClick={() => setIsModalOpen(!isModalOpen)}
                  className="cursor-pointer bg-[#00B8A9] w-50 text-white px-4 py-2 rounded-full hover:bg-[#008C8D] transition-colors"
                >
                  สร้างบัตรพนักงานใหม่
                </button>
              </div>
            </div>{" "}
            <div className="p-5 overflow-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {filteredCards.map((card) => (
                  <div
                    key={card._id}
                    className="relative rounded-xl shadow border border-blue-900/20 flex flex-col items-center bg-white p-4"
                  >
                    {/* ตัวอย่างบัตรตามแนว */}
                    <img
                      src={`/IDCard/${
                        card.cardType === "horizontal"
                          ? "Horizontal"
                          : "Vertical"
                      }.png`}
                      alt="preview"
                      className={`${
                        card.cardType === "horizontal"
                          ? "w-[100px] h-auto"
                          : "h-[100px] w-auto"
                      }`}
                    />
                    {/* ข้อมูลสั้นๆ */}
                    <div className="mt-3 text-center">
                      <p className="text-sm font-medium">
                        ID: {card.employeeId} {card.firstName}
                      </p>
                      <p className="text-sm text-gray-600">({card.nickname})</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {isModalOpen && (
        <EmployeeCardForm onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default HRCardGenerator;
