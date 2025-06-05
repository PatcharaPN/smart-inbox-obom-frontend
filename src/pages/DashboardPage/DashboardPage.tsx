import Modal from "../../components/Modal/Modal";
import IndicatorCard from "../../components/IndicatorCard/IndicatorCard";
import GraphArea from "../../components/GraphComponent/GraphComponent";
import WeeklyGraph from "../../components/GraphComponent/GraphComponent2";

const DashboardPage = () => {
  return (
    <>
      <div className="px-10">
        <h1 className="text-4xl mt-10 text-[#0065AD] font-semibold">
          แดชบอร์ด
        </h1>
        <div className="flex gap-10 w-fullitems-center py-5">
          <IndicatorCard color={"#28A745"} section={"date"} />
          <IndicatorCard color={"#208CFF"} section={"weekly"} />
          <IndicatorCard color={"#6F42C1"} section={"month"} />
        </div>
        <div className="grid grid-cols-2">
          <GraphArea />
          <WeeklyGraph />
        </div>
        <div className="grid grid-cols-[1000px_auto] gap-2 mt-5">
          <Modal>
            <div className="w-[93vh] h-[20vh]">
              <p className="font-semibold">จำนวนเช้าชมแต่ละหน้า</p>
            </div>
          </Modal>
          <Modal>
            <div className="w-[47vh] h-[20vh]">
              <p className="font-semibold">จำนวนเช้าชมปัจจุบัน</p>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
