import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import { Icon } from "@iconify/react/dist/iconify.js";
import axiosInstance from "../../api/axiosInstance";
import { io, Socket } from "socket.io-client";

type IndicatorCardProps = {
  color: string;
  section: "date" | "weekly" | "month" | "realtime";
  value?: number;
};

const IndicatorCard = ({ color, section }: IndicatorCardProps) => {
  const [dairyView, setDairyView] = useState<number | null>(null);
  const [realtimeCount, setRealtimeCount] = useState<number | null>(null);

  useEffect(() => {
    //* ถ้าเป็น section "realtime" จะเชื่อมต่อกับ WebSocket

    if (section === "realtime") {
      //* เชื่อมต่อกับ WebSocket สำหรับการนับผู้เข้าชมแบบเรียลไทม์

      const socket: Socket = io(
        "wss://obom-server.tail7f9ceb.ts.net/api/socket.io"
      );

      socket.on("connect", () => {
        console.log("Socket connected for realtime visitor count");

        //* สุ่ม UUID เพื่อระบุตัวตนของผู้เข้าชม

        socket.emit("company-visitor", crypto.randomUUID());
      });

      //* รับข้อมูลจำนวนผู้เข้าชมออนไลน์จาก WebSocket

      socket.on("company-online-count", (count: number) => {
        setRealtimeCount(count);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      return () => {
        socket.disconnect();
      };
    } else {
      // For non-realtime sections, fetch from API
      const today = new Date();
      const getDateString = (d: Date) => d.toISOString().split("T")[0];

      let startDate = "";
      let endDate = getDateString(today);
      let granularity = "daily"; // default

      if (section === "date") {
        startDate = endDate;
      } else if (section === "weekly") {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startDate = getDateString(startOfWeek);
      } else if (section === "month") {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate = getDateString(startOfMonth);
        granularity = "monthly";
      }

      async function fetchGAData() {
        try {
          const res = await axiosInstance.get("/ga4-report", {
            params: {
              granularity,
              startDate,
              endDate,
            },
          });

          const data = await res.data;

          const homepageRow = data.rows?.find(
            (row: any) =>
              row.dimensionValues &&
              row.dimensionValues.length > 1 &&
              row.dimensionValues[1].value === "/"
          );

          if (
            homepageRow &&
            homepageRow.metricValues &&
            homepageRow.metricValues[0]
          ) {
            const screenPageViews = Number(homepageRow.metricValues[0].value);
            setDairyView(screenPageViews);
          } else {
            setDairyView(0);
          }
        } catch (error) {
          console.error("Failed to fetch GA data", error);
          setDairyView(0);
        }
      }

      fetchGAData();
    }
  }, [section]);

  const sectionName = (section: string) => {
    if (section === "date") return "วัน";
    if (section === "weekly") return "อาทิตย์";
    if (section === "month") return "เดือน";
    if (section === "realtime") return "ออนไลน์ตอนนี้";
    return "";
  };

  return (
    <Modal>
      <div className="w-[300px] h-auto">
        <div className="grid grid-cols-[30px_100px_auto]">
          <div className="flex justify-center items-center">
            <Icon icon="tabler:calendar-week-filled" width="24" height="24" />
          </div>
          <div className="flex justify-center items-center">
            <p>จำนวนเช้าชม</p>
          </div>
          <div className="flex justify-end items-center">
            <Icon
              icon="solar:eye-outline"
              width="30"
              height="30"
              color={color}
            />
          </div>
        </div>
        <div className="flex justify-center items-center h-30">
          <div className="flex items-center gap-2">
            <p style={{ color }} className={`text-7xl font-bold`}>
              {section === "realtime" ? realtimeCount ?? "-" : dairyView ?? "-"}
            </p>
            <p style={{ color }} className={`self-end text-2xl font-semibold`}>
              คน
            </p>
          </div>
        </div>
        <div
          style={{ color }}
          className={`flex justify-end items-center font-semibold`}
        >
          <p>{sectionName(section)}</p>
        </div>
      </div>
    </Modal>
  );
};

export default IndicatorCard;
