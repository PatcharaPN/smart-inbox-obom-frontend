const DepartmentCard = () => {
  return (
    <div className="select-none h-[24vh] w-50 shadow grid grid-rows-[0.8fr_auto] rounded-2xl hover:scale-101 transition cursor-pointer">
      <div className="p-2 flex justify-center items-center">
        <div className="w-40 h-40 rounded-2xl p-4 bg-cyan-600 flex justify-center items-center text-4xl text-white">
          PS
        </div>
      </div>
      <p className="pl-5 font-semibold">Purchase</p>
    </div>
  );
};

export default DepartmentCard;
