import { Icon } from "@iconify/react/dist/iconify.js";

type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: (e: string) => void;
};

const SearchBarComponent = ({ searchTerm, setSearchTerm }: SearchBarProps) => {
  return (
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
  );
};

export default SearchBarComponent;
