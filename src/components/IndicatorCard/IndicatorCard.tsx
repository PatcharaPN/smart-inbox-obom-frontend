import React from "react";
import Modal from "../Modal/Modal";
import { Icon } from "@iconify/react/dist/iconify.js";

type IndicatorCard = {
  color: string;
  section: string;
  number: string;
};

const IndicatorCard = ({ color, section, number }: IndicatorCard) => {
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
              {number ? number : 0}
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
          <p>{section ? section : "รายวัน"}</p>
        </div>
      </div>
    </Modal>
  );
};

export default IndicatorCard;
