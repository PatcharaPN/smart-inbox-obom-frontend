import React from "react";
import Modal from "../../components/Modal/Modal";
import { Icon } from "@iconify/react/dist/iconify.js";
import IndicatorCard from "../../components/IndicatorCard/IndicatorCard";
import GraphArea from "../../components/GraphComponent/GraphComponent";
import GraphArea2 from "../../components/GraphComponent/GraphComponent2";

const DashboardPage = () => {
  return (
    <>
      <div className="px-10">
        <h1 className="text-4xl mt-10 text-[#0065AD] font-semibold">
          แดชบอร์ด
        </h1>
        <div className="flex gap-10 w-fullitems-center py-5">
          <IndicatorCard color={"#28A745"} section={"รายวัน"} number={"12"} />
          <IndicatorCard color={"#208CFF"} section={"สัปดาห์"} number={"12"} />
          <IndicatorCard color={"#6F42C1"} section={"รายเดือน"} number={"12"} />
          <IndicatorCard color={"#045893"} section={"รายวัน"} number={"12"} />
        </div>
        <div className="grid grid-cols-2">
          {" "}
          <GraphArea />
          <GraphArea2 />
        </div>
        <div className="grid grid-cols-[1000px_auto] gap-2 mt-5">
          <Modal>
            <div className="w-[100vh] h-[22vh]">
              <p className="font-semibold">จำนวนเช้าชมแต่ละหน้า</p>
            </div>
          </Modal>
          <Modal>
            <div className="w-[47vh] h-[22vh]">
              <p className="font-semibold">จำนวนเช้าชมปัจจุบัน</p>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
