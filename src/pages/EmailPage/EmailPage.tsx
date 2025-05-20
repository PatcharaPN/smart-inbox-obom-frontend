import Modal from "../../components/Modal/Modal";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formattedDate } from "../../hooks/useDateConvert";
import AllEmailsComponent from "../../components/AllEmailsComponent/AllEmailsComponent";

const EmailPage = () => {
  return (
    <>
      <div className="p-10">
        <div className="py-10 flex flex-col gap-2">
          <p className=" text-3xl">รายการอีเมลล์ทั้งหมด</p>
          <div className="flex items-end gap-2 opacity-40">
            <Icon icon="material-symbols:refresh" width="24" height="24" />
            <p className="self-end ">อัพเดทล่าสุด {formattedDate}</p>
          </div>
        </div>
        <div className="">
          <Modal>
            <AllEmailsComponent />
          </Modal>
        </div>
      </div>
    </>
  );
};

export default EmailPage;
