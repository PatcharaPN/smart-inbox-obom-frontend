import React from "react";
import Modal from "../../components/Modal/Modal";
import { Icon } from "@iconify/react/dist/iconify.js";

type Props = {};

const DashboardPage = (props: Props) => {
  return (
    <>
      <div className="p-10">
        <h1 className="text-4xl text-[#0065AD] font-semibold">แดชบอร์ด</h1>
        <Modal>
          <div className="w-[300px] h-auto">
            <div className="grid grid-cols-[30px_100px_auto]">
              <div className="flex justify-center items-center">
                <Icon
                  icon="tabler:calendar-week-filled"
                  width="24"
                  height="24"
                />
              </div>
              <div>จำนวนเช้าชม</div>
              <div className="flex justify-end items-center">
                <Icon icon="solar:eye-outline" width="24" height="24" />
              </div>
            </div>
            <div className="flex justify-center items-center h-30">
              <div className="flex ">
                <p className="text-7xl">0</p>
                <p className="self-end text-2xl">คน</p>
              </div>
            </div>
            <div className="flex justify-end items-center">
              <p>รายวัน</p>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default DashboardPage;
