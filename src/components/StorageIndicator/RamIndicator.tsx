import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import UsageCircle from "../UsageCircle/UsageCircle";
import axios from "axios";

interface RamData {
  status: string;
  totalRam: number;
  usedRam: number;
  freeRam: number;
  percentUsed: number;
  percentFree: number;
}
const RamIndicator = () => {
  const [diskData, setDiskData] = useState<RamData>();

  useEffect(() => {
    const fetchDisk = async () => {
      const res = await axios(`${import.meta.env.VITE_BASE_URL}/ram-usage`);
      const diskResult = res.data;
      setDiskData(diskResult);
    };
    fetchDisk();
    const Interval = setInterval(fetchDisk, 1000);
    return () => clearInterval(Interval);
  }, []);
  const convertBytesToGB = (bytes: number) => {
    const gb = bytes / 1024 ** 3;
    return gb.toFixed(2);
  };
  return (
    <div className="w-full max-w-[300px] h-full  max-h-[190px] flex flex-row cursor-pointer hover:scale-101 transition-all duration-300 ease-in-out">
      <Modal>
        <p className="py-1">แรมที่ใช้ไปของ Server</p>
        <div className="h-full xl:h-22  flex justify-between items-center gap-10">
          {" "}
          <UsageCircle
            type="ram"
            label={""}
            usedPercent={diskData?.percentUsed ?? 0}
          />
          <div className="opacity-60">
            {" "}
            <div>
              <p className="text-[0.8rem]">ใช้ไป</p>
              <div className="flex gap-2">
                <p className="lg:text-lg text-2xl">
                  {convertBytesToGB(diskData?.usedRam ?? 0)}{" "}
                </p>
                <p className="text-md self-end">GB</p>
              </div>
            </div>{" "}
            <div>
              <p className="text-[0.8rem]">จาก</p>
              <div className="flex gap-2">
                <p className="lg:text-lg text-2xl">
                  {convertBytesToGB(diskData?.totalRam ?? 0)}{" "}
                </p>
                <p className="text-md self-end">GB</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RamIndicator;
