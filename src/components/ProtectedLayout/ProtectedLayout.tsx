import Sidebar from "../Sidebar/Sidebar";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-[280px_1fr] w-full h-full">
      <Sidebar />
      {children}
    </div>
  );
};

export default ProtectedLayout;
