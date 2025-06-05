import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Modal from "../Modal/Modal";
import axiosInstance from "../../api/axiosInstance";

const monthsThai = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

const formatMonthThai = (raw: string) => {
  const monthIndex = Number(raw) - 1;
  return monthsThai[monthIndex] ?? raw;
};

const fillMissingMonths = (
  data: { month: string; views: number }[],
  pastCount = 5,
  futureCount = 2
) => {
  const now = new Date();
  const monthsArray: string[] = [];

  for (let i = -pastCount; i <= futureCount; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const label = monthsThai[d.getMonth()];
    monthsArray.push(label);
  }

  return monthsArray.map((label) => {
    const found = data.find((item) => item.month === label);
    return found || { month: label, views: 0 };
  });
};

const GraphArea: React.FC = () => {
  const [data, setData] = useState<{ month: string; views: number }[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axiosInstance.get("/ga4-report", {
        params: { granularity: "monthly" },
      });
      const result = await res.data;

      if (!result.rows) return;

      const transformed = result.rows.map((row: any) => {
        const rawDate = row.dimensionValues[0].value;
        const views = Number(row.metricValues[0].value);

        return {
          month: formatMonthThai(rawDate),
          views: isNaN(views) ? 0 : views,
        };
      });

      const aggregated = transformed.reduce((acc: any[], row: any) => {
        const existing = acc.find((item) => item.month === row.month);
        if (existing) {
          existing.views += row.views;
        } else {
          acc.push({ month: row.month, views: row.views });
        }
        return acc;
      }, []);

      const finalData = fillMissingMonths(aggregated);
      setData(finalData);
    }

    fetchData();
  }, []);

  return (
    <Modal>
      <div className="w-[680px] h-[278px] pb-10">
        <p className="font-semibold mb-2">กราฟจำนวนผู้เข้าชมรายเดือน</p>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6F42C1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6F42C1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tickFormatter={(text) => text.split(" ")[0]}
              label={{
                value: "",
                position: "insideBottomRight",
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: "จำนวนผู้เข้าชม",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#6F42C1"
              fillOpacity={1}
              fill="url(#colorViews)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Modal>
  );
};

export default GraphArea;
