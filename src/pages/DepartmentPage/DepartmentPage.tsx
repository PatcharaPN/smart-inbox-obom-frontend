import { Icon } from "@iconify/react/dist/iconify.js";
import Modal from "../../components/Modal/Modal";
import DepartmentCard from "../../components/DepartmentCard/DepartmentCard";

const DepartmentPage = () => {
  const userFromStorage = localStorage.getItem("user");
  const user = userFromStorage ? JSON.parse(userFromStorage) : null;
  return (
    <>
      <section className="p-10 flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl">แผนก</h1>
          {user?.role === "admin" ? (
            <div className="cursor-pointer w-10 h-10 flex justify-center items-center bg-white rounded-sm shadow">
              <Icon icon={"ic:baseline-plus"} width={24} height={24} />
            </div>
          ) : null}
        </div>
        {/* <Modal>
          <div className="min-h-[78vh]"></div>
        </Modal> */}
        <div>
          <DepartmentCard />
        </div>
      </section>
    </>
  );
};

export default DepartmentPage;
