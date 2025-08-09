import { Icon } from "@iconify/react";
import SearchBarComponent from "../SearchBar/SearchBarComponent";

type EmailFilterBarProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  years: number[];
  folder: string;
  setFolder: (value: string) => void;
  onRefresh: () => void;
  onSyncNewsEmail: () => void;
  onOpenDateModal: () => void;
};

const folders = [
  { value: "INBOX", label: "กล่องจดหมาย" },
  { value: "Sent", label: "จดหมายที่ส่ง" },
  { value: "Spam", label: "จดหมายสแปม" },
  { value: "Trash", label: "จดหมายขยะ" },
  { value: "Drafts", label: "ร่างจดหมาย" },
  { value: "", label: "จดหมายกักเก็บ" },
];

const EmailFilterBar = ({
  searchTerm,
  setSearchTerm,
  selectedYear,
  setSelectedYear,
  years,
  folder,
  setFolder,
  onRefresh,
  onSyncNewsEmail,
  onOpenDateModal,
}: EmailFilterBarProps) => {
  return (
    <div className="flex gap-2 items-center w-full flex-wrap">
      <SearchBarComponent
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <select
        onChange={(e) => setSelectedYear(e.target.value)}
        value={selectedYear}
        className="w-fit my-2 bg-white rounded-full pl-2 pr-4 py-2 focus:ring-[#0065AD] focus:border-[#0065AD] focus:outline-none shadow border border-[#0065AD]"
      >
        <option value="all">ทั้งหมด</option>
        {years.map((year, index) => (
          <option key={index} value={year.toString()}>
            {year}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => setFolder(e.target.value)}
        value={folder}
        className="w-fit my-2 bg-white rounded-full pl-2 pr-4 py-2 focus:ring-[#0065AD] focus:border-[#0065AD] focus:outline-none shadow border border-[#0065AD]"
      >
        <option value="all">ทั้งหมด</option>
        {folders.map((item, index) => (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <div
        className="cursor-pointer flex w-fit items-center gap-2 p-2 rounded-full text-white bg-[#045893]/75"
        onClick={onRefresh}
      >
        <Icon icon="material-symbols:refresh-rounded" width="24" height="24" />
        <button className="cursor-pointer w-full text-md">รีเฟรช</button>
      </div>

      <div className="flex gap-2 ml-auto">
        <button
          onClick={onSyncNewsEmail}
          className="cursor-pointer bg-[#0065AD] text-white rounded-full px-4 py-2 hover:bg-[#005A8C] transition duration-200"
        >
          ดึงข้อมูลล่าสุด
        </button>
        <button
          onClick={onOpenDateModal}
          className="cursor-pointer bg-[#007078] text-white rounded-full px-4 py-2 hover:bg-[#00575D] transition duration-200"
        >
          ดึงข้อมูลเฉพาะวันที่
        </button>
      </div>
    </div>
  );
};

export default EmailFilterBar;
