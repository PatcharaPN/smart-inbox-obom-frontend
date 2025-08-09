const EmailTableHeader = () => (
  <div className="sticky w-full bg-white grid grid-cols-[40px_100px_3fr_3fr_1fr_1fr_1fr] md:grid-cols-[40px_100px_3fr_2fr_2fr_1fr_1fr] gap-2 items-center border-b border-gray-200">
    <div className="flex justify-center  items-center border-r border-gray-300 p-2">
      <input type="checkbox" />
    </div>
    <div className="flex justify-center items-center border-r border-gray-300 p-2">
      วันที่
    </div>
    <div className="flex items-center border-r border-gray-300 p-2">หัวข้อ</div>{" "}
    <div className="flex items-center border-r border-gray-300 p-2">จาก</div>
    <div className="flex items-center border-r border-gray-300 p-2">ถึง</div>
    <div className="flex items-center border-r border-gray-300 p-2">ขนาด</div>
    <div className="flex justify-center items-center p-2">ดำเนินการ</div>
  </div>
);
export default EmailTableHeader;
