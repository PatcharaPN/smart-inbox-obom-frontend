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
    <div className="w-full max-w-[300px] h-full max-h-[190px] 2xl:max-h-[250px] flex flex-row cursor-pointer hover:scale-101 transition-all duration-300 ease-in-out">
      <Modal>
        <p className="text-sm 2xl:text-base py-1 2xl:py-2">
          แรมที่ใช้ไปของ Server
        </p>

        <div className="h-full flex justify-between items-center gap-10 2xl:gap-14">
          <UsageCircle
            type="ram"
            label=""
            usedPercent={diskData?.percentUsed ?? 0}
          />

          <div className="opacity-60 space-y-2">
            <div>
              <p className="text-[0.8rem] 2xl:text-sm">ใช้ไป</p>
              <div className="flex gap-2">
                <p className="text-2xl 2xl:text-3xl">
                  {convertBytesToGB(diskData?.usedRam ?? 0)}
                </p>
                <p className="text-md 2xl:text-lg self-end">GB</p>
              </div>
            </div>

            <div>
              <p className="text-[0.8rem] 2xl:text-sm">จาก</p>
              <div className="flex gap-2">
                <p className="text-2xl 2xl:text-3xl">
                  {convertBytesToGB(diskData?.totalRam ?? 0)}
                </p>
                <p className="text-md 2xl:text-lg self-end">GB</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RamIndicator;
