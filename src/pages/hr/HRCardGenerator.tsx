import { useState } from "react";
import Modal from "../../components/Modal/Modal";
import SearchBarComponent from "../../components/SearchBar/SearchBarComponent";
import EmployeeCardForm from "../../components/EmployeeCardForm/EmployeeCardForm";

const HRCardGenerator = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
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
                  searchTerm={""}
                  setSearchTerm={function (e: string): void {
                    throw new Error("Function not implemented.");
                  }}
                />
                <button className="cursor-pointer bg-[#00B8A9] w-50 text-white px-4 py-2 rounded-full hover:bg-[#008C8D] transition-colors">
                  สร้างบัตรพนักงานใหม่
                </button>
              </div>
            </div>{" "}
            <div></div>
          </div>
        </div>
      </Modal>
      {isModalOpen && (
        <EmployeeCardForm
          onClose={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </div>
  );
};

export default HRCardGenerator;
