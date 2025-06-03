import React, { useEffect, useState } from "react";
import { Area } from "@ant-design/plots";
import Modal from "../Modal/Modal";
import axiosInstance from "../../api/axiosInstance";

const formatMonthThai = (raw: string) => {
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

  const month = Number(raw.slice(4, 6)) - 1;
  return monthsThai[month];
};
const fillMissingMonths = (
  data: { month: string; views: number }[],
  pastCount = 5,
  futureCount = 2
) => {
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

  const now = new Date();
  const monthsArray: string[] = [];

  for (let i = -pastCount; i <= futureCount; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const label = monthsThai[d.getMonth()];
    monthsArray.push(label);
  }

  const filled = monthsArray.map((label) => {
    const found = data.find((item) => item.month === label);
    return found || { month: label, views: 0 };
  });

  return filled;
};

const GraphArea: React.FC = () => {
  const [data, setData] = useState<{ month: string; views: number }[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axiosInstance.get("/ga4-report", {
        params: { granularity: "monthly" },
      });
      const result = await res.data();
      console.log("API result:", result);

      if (!result.rows) return;

      const transformed = result.rows.map((row: any) => {
        const rawDate = row.dimensionValues[0].value;
        const views = Number(row.metricValues[0].value);

        return {
          month: formatMonthThai(rawDate),
          views,
        };
      });
      console.log("Transformed data:", transformed);

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

  const config = {
    data,
    xField: "month",
    yField: "views",
    smooth: true,
    areaStyle: {
      fill: ":#AE00FF",
    },
    line: {
      style: {
        stroke: "#6F42C1",
        strokeWidth: 2,
      },
    },

    xAxis: {
      title: { text: "เดือน" },
      label: {
        formatter: (text: string) => text.split(" ")[0], // แสดงเฉพาะชื่อเดือน
      },
    },
    yAxis: {
      title: { text: "จำนวนผู้เข้าชม" },
    },
  };

  return (
    <Modal>
      <div className="w-[680px] h-[300px]">
        <p className="font-semibold mb-2">กราฟจำนวนผู้เข้าชมรายเดือน</p>
        <Area {...config} />
      </div>
    </Modal>
  );
};

export default GraphArea;
