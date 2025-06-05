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
        params: {
          granularity: "daily",
          dimensions: "date,pagePath",
          metrics: "screenPageViews",
        },
      });
      const result = await res.data;
      if (!result.rows) return;

      const transformed = result.rows.map((row: any) => {
        const rawDate = row.dimensionValues[0].value;
        const views = Number(row.metricValues[0].value);

        return {
          day: formatWeekdayThai(rawDate),
          views,
        };
      });

      const aggregated = transformed.reduce((acc: any[], row: any) => {
        const existing = acc.find((item) => item.day === row.day);
        if (existing) {
          existing.views += row.views;
        } else {
          acc.push({ day: row.day, views: row.views });
        }
        return acc;
      }, []);

      const finalData = fillMissingWeekdays(aggregated).sort(
        (a, b) => weekThai.indexOf(a.day) - weekThai.indexOf(b.day)
      );
      setData(finalData);
    }

    fetchData();
  }, []);

  return (
    <Modal>
      <p className="font-semibold mb-2">กราฟจำนวนผู้เข้าชมรายเดือน</p>
      <div style={{ width: 680, height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0047AB" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0047AB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#0047AB"
              fillOpacity={1}
              fill="url(#colorBlue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Modal>
  );
};

export default WeeklyGraph;
