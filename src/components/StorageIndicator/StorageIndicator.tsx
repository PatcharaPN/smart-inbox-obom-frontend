import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import UsageCircle from "../UsageCircle/UsageCircle";
import axios from "axios";

interface DiskData {
  status: string;
  totalDiskSpace: number;
  usedDiskSpace: number;
  freeDiskSpace: number;
  percentUsed: number;
  percentFree: number;
}
const StorageIndicator = () => {
  const [diskData, setDiskData] = useState<DiskData>();

  useEffect(() => {
    const fetchDisk = async () => {
      const res = await axios(`${import.meta.env.VITE_BASE_URL}/disk-usage`);
      const diskResult = res.data;
      setDiskData(diskResult);
    };
    fetchDisk();
    const Interval = setInterval(fetchDisk, 5000);
    return () => clearInterval(Interval);
  }, []);
  const convertBytesToGB = (bytes: number) => {
    const gb = bytes / 1024 ** 3;
    return gb.toFixed(2);
  };
  return (
    <div className="w-full max-w-[300px] h-full max-h-[190px] flex flex-row cursor-pointer hover:scale-101 transition-all duration-300 ease-in-out">
      <Modal>
        <p className="py-1">พื้นที่จัดเก็บ Server</p>
        <div className="h-full flex justify-between items-center gap-10">
          <UsageCircle label={""} usedPercent={diskData?.percentUsed ?? 0} />
          <div className="opacity-60">
            <div>
              <p className="text-[0.8rem]">ใช้ไป</p>
              <div className="flex gap-2">
                <p className="text-2xl">
                  {convertBytesToGB(diskData?.usedDiskSpace ?? 0)}{" "}
                </p>
                <p className="text-md self-end">GB</p>
              </div>
            </div>{" "}
            <div>
              <p className="text-[0.8rem]">จาก</p>
              <div className="flex gap-2">
                <p className="text-2xl">
                  {convertBytesToGB(diskData?.totalDiskSpace ?? 0)}{" "}
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

export default StorageIndicator;
