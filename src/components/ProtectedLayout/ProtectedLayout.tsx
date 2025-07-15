import NotificationBubble from "../NotificationBubble/NotificationBubble";
import Sidebar from "../Sidebar/Sidebar";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="transition-all grid grid-cols-[300px_1fr] lg:grid-cols-[250px_1fr] xl:grid-cols-[300px_1fr] w-full h-full">
      <Sidebar />
      <NotificationBubble />
      {children}
    </div>
  );
};

export default ProtectedLayout;
