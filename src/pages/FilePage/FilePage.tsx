import Modal from "../../components/Modal/Modal";

const FilePage = () => {
  return (
    <>
      <div className="">
        <div className="p-10">
          <div className="grid grid-rows-[0.3fr_1fr] items-center">
            <h1 className="text-3xl">ไฟล์</h1>

            <Modal>
              <div className="h-[67vh] grid grid-rows-[0.1fr_auto] p-5">
                <div className="border-b border-b-black flex justify-start items-center h-full">
                  <p>1</p>
                </div>
                <div></div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilePage;
