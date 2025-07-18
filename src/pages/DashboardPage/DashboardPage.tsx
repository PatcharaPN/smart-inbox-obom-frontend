import { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import IndicatorCard from "../../components/IndicatorCard/IndicatorCard";
import GraphArea from "../../components/GraphComponent/GraphComponent";
import WeeklyGraph from "../../components/GraphComponent/GraphComponent2";
import { useUser } from "../../api/contexts/userContext";
import axiosInstance from "../../api/axiosInstance";

type Row = {
  dimensionValues: { value: string }[];
  metricValues: { value: string }[];
};

type AnalyticsData = {
  rows: Row[];
};

const DashboardPage = () => {
  const { currentUser, refreshUser } = useUser();

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await axiosInstance("/ga4-report");
        if (!res.status) throw new Error("Failed to fetch analytics data");
        const json: AnalyticsData = await res.data;
        setData(json);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const pageViewsMap: Record<string, number> = {};
  if (data) {
    data.rows.forEach((row) => {
      const pagePath = row.dimensionValues[1].value;
      const views = parseInt(row.metricValues[0].value, 10);
      if (!pageViewsMap[pagePath]) {
        pageViewsMap[pagePath] = 0;
      }
      pageViewsMap[pagePath] += views;
    });
  }

  if (!currentUser) {
    return <div>Loading user...</div>;
  }

  // if (currentUser.isAdmin !== true) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  if (loading) {
    return <div>Loading analytics data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="px-10">
      <h1 className="text-4xl mt-10 text-[#0065AD] font-semibold">แดชบอร์ด</h1>
      <div className="flex gap-10 w-full items-center py-5">
        <IndicatorCard color={"#28A745"} section={"date"} />
        <IndicatorCard color={"#208CFF"} section={"weekly"} />
        <IndicatorCard color={"#6F42C1"} section={"month"} />
        <IndicatorCard color={"#F74A5C"} section={"realtime"} />
      </div>
      <div className="grid grid-cols-2">
        <GraphArea />
        <WeeklyGraph />
      </div>
      <div className="grid grid-cols-[1000px_auto] gap-2 mt-5">
        <Modal>
          <div
            className="relative max-w-full max-h-[220px] overflow-auto p-2 bg-white rounded-lg"
            style={{ minWidth: "500px" }}
          >
            <p className="font-semibold mb-2 text-gray-900 text-sm">
              จำนวนเข้าชมแต่ละหน้า (รวม)
            </p>

            {/* Sticky header */}
            <div
              className="sticky top-0 z-20 bg-white
         grid grid-cols-[30px_80px_2.5fr_2.5fr_0.8fr] md:grid-cols-[30px_80px_2.5fr_2fr_0.8fr]
         gap-1 items-center border-b border-gray-300
         px-1.5 py-1 text-gray-700 font-semibold select-none text-sm"
            >
              <div className="flex justify-center items-center border-r border-gray-300 p-1">
                <input type="checkbox" />
              </div>
              <div className="flex justify-center items-center border-r border-gray-300 p-1">
                วันที่
              </div>
              <div className="flex items-center border-r border-gray-300 p-1">
                หน้า
              </div>
              <div className="flex items-center border-r border-gray-300 p-1">
                เส้นทาง
              </div>
              <div className="flex items-center border-r border-gray-300 p-1">
                จำนวน
              </div>
            </div>

            {/* Scrollable list */}
            <ul className="divide-y divide-gray-200 text-sm">
              {Object.entries(pageViewsMap).map(([page, views], index) => (
                <li
                  key={page}
                  className={`grid grid-cols-[30px_80px_2.5fr_2.5fr_0.8fr] md:grid-cols-[30px_80px_2.5fr_2fr_0.8fr] gap-1 items-center px-1.5 py-1
            ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}
            hover:bg-blue-50 cursor-pointer
          `}
                  title={`Page: ${page}, Views: ${views}`}
                >
                  <div className="flex justify-center items-center border-r border-gray-300 p-1">
                    <input type="checkbox" />
                  </div>
                  <div className="flex justify-center items-center border-r border-gray-300 p-1">
                    -
                  </div>
                  <div className="flex items-center border-r border-gray-300 p-1">
                    {page}
                  </div>
                  <div className="flex items-center border-r border-gray-300 p-1">
                    {page}
                  </div>
                  <div className="flex items-center border-r border-gray-300 p-1">
                    {views}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Modal>

        <Modal>
          <div className="w-[47vh] h-[20vh]">
            <p className="font-semibold">จำนวนเข้าชมปัจจุบัน</p>
            {/* ใส่ข้อมูล realtime หรืออื่น ๆ ตามต้องการ */}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DashboardPage;
