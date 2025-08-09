type PaginationProps = {
  page: number;
  totalPage: number;
  onPageChange: (newPage: number) => void;
};
const PaginationComponent = ({
  page,
  totalPage,
  onPageChange,
}: PaginationProps) => (
  <div className="py-1">
    {/* Pagination */}
    <div className="sticky flex gap-2 items-center justify-center py-2">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="cursor-pointer hover:bg-black/20 transition duration-150 text-sm px-2 py-1 border rounded disabled:opacity-50"
      >
        ก่อนหน้า
      </button>

      <span className="text-sm">
        หน้า {page} จาก {totalPage}
      </span>

      <button
        disabled={page === totalPage}
        onClick={() => onPageChange(page + 1)}
        className="cursor-pointer hover:bg-black/20 transition duration-150 text-sm px-2 py-1 border rounded disabled:opacity-50"
      >
        ถัดไป
      </button>
    </div>
  </div>
);

export default PaginationComponent;
