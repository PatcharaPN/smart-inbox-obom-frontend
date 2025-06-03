import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import { Icon } from "@iconify/react/dist/iconify.js";
import axiosInstance from "../../api/axiosInstance";

type IndicatorCard = {
  color: string;
  section: string;
};

const IndicatorCard = ({ color, section }: IndicatorCard) => {
  const [dairyView, setDairyView] = useState<number | null>(null);
  useEffect(() => {
    async function fetchGAData() {
      try {
        const res = await axiosInstance.get("/ga4-report", {
          params: { granularity: "monthly" },
        });
        const data = await res.data();

        const homepageRow = data.rows.find(
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

    if (section) {
      fetchGAData();
    }
  }, [section]);

  const sectionName = (section: string) => {
    let sectionName;

    if (section === "date") {
      sectionName = "วัน";
    } else if (section === "weekly") {
      sectionName = "อาทิตย์";
    } else if (section === "month") {
      sectionName = "เดือน";
    }

    return sectionName;
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
              {dairyView}
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
