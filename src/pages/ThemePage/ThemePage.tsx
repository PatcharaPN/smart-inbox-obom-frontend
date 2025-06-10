const ThemePage = () => {
  return (
    <>
      <section className="p-10 border-b border-gray-200">
        <p className="text-3xl">ธีม</p>
        <p className="opacity-70">
          ปรับเปลี่ยนโทนสีและสไตล์ของเว็บไซต์ตามความชอบของคุณ
        </p>
      </section>

      <section className="p-10 border-b border-gray-200">
        <p className="opacity-70 text-xl">เลือกธีมอินเตอร์เฟช</p>

        <div className="p-5 flex gap-5 items-center justify-evenly">
          <div className="flex flex-col items-center">
            <img className="w-40" src="/System_Theme.png" alt="Dark Theme" />
            <p className="text-xl mt-2 self-start">ระบบ</p>
          </div>
          <div className="flex flex-col items-center">
            <img className="w-40" src="/White_Theme.png" alt="Dark Theme" />
            <p className="text-xl mt-2 self-start">ธีมสว่าง</p>
          </div>{" "}
          <div className="flex flex-col items-center">
            <img className="w-40" src="/Dark_theme.png" alt="Dark Theme" />
            <p className="text-xl mt-2 self-start">ธีมมืด</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ThemePage;
