import Sidebar from "../Sidebar/Sidebar";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-[300px_1fr] lg:grid-cols-[250px_1fr] xl:grid-cols-[300px_1fr] w-full h-full">
      <Sidebar />
      {children}
    </div>
  );
};

export default ProtectedLayout;
