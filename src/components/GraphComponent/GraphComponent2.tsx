import React, { useEffect, useState } from "react";
import { Area } from "@ant-design/plots";
import Modal from "../Modal/Modal";
import axiosInstance from "../../api/axiosInstance";

const weekThai = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];

const formatWeekdayThai = (raw: string) => {
  const date = new Date(
    Number(raw.slice(0, 4)),
    Number(raw.slice(4, 6)) - 1,
    Number(raw.slice(6, 8))
  );

  const day = date.getDay();
  const index = day === 0 ? 6 : day - 1;
  return weekThai[index];
};

const fillMissingWeekdays = (
  data: { day: string; views: number }[]
): { day: string; views: number }[] => {
  return weekThai.map((day) => {
    const found = data.find((item) => item.day === day);
    return found || { day, views: 0 };
  });
};

const WeeklyGraph: React.FC = () => {
  const [data, setData] = useState<{ day: string; views: number }[]>([]);

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
          day: formatWeekdayThai(rawDate),
          views,
        };
      });
      console.log("Transformed data:", transformed);

      const aggregated = transformed.reduce((acc: any[], row: any) => {
        const existing = acc.find((item) => item.day === row.day);
        if (existing) {
          existing.views += row.views;
        } else {
          acc.push({ day: row.day, views: row.views });
        }
        return acc;
      }, []);

      const finalData = fillMissingWeekdays(aggregated);
      setData(finalData);
    }

    fetchData();
  }, []);

  const config = {
    data,
    xField: "day",
    yField: "views",
    smooth: true,
    areaStyle: {
      fill: "l(270) 0:#ffffff 1:#6F42C1",
    },
    line: {
      style: {
        stroke: "#6F42C1",
        strokeWidth: 2,
      },
    },
    xAxis: {
      title: { text: "วันในสัปดาห์" },
    },
    yAxis: {
      title: { text: "จำนวนผู้เข้าชม" },
    },
  };

  return (
    <Modal>
      <div className="w-[680px] h-[300px]">
        <p className="font-semibold mb-2">กราฟจำนวนผู้เข้าชมรายสัปดาห์</p>
        <Area {...config} />
      </div>
    </Modal>
  );
};

export default WeeklyGraph;
