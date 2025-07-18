import Modal from "../../components/Modal/Modal";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formattedDate } from "../../hooks/useDateConvert";
import AllEmailsComponent from "../../components/AllEmailsComponent/AllEmailsComponent";
import { useNavigate } from "react-router-dom";

const EmailPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="p-10">
        <div className="">
          <Modal onBack={() => navigate(-1)}>
            {" "}
            <div className="py-10 flex flex-col gap-2">
              <p className=" text-3xl">รายการอีเมลล์ทั้งหมด</p>
              <div className="flex items-end gap-2 opacity-40">
                <Icon icon="material-symbols:refresh" width="24" height="24" />
                <p className="self-end ">อัพเดทล่าสุด {formattedDate}</p>
              </div>
            </div>
            <AllEmailsComponent />
          </Modal>
        </div>
      </div>
    </>
  );
};

export default EmailPage;
