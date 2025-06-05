import DepartmentCard from "../../components/DepartmentCard/DepartmentCard";

const DepartmentPage = () => {
  return (
    <>
      <section className="p-10 flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl">แผนก</h1>
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
