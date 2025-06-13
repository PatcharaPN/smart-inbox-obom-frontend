export interface UserListComponentProps {
  user: User[];
  userHistoryMap: Record<string, string>;
}

export interface User {
  _id?: string;
  id?: number;
  name?: string;
  surname?: string;
  username?: string;
  categories?: string;
  role?: string;
  profilePic?: string;
  action?: string;
  loginAt?: string;
}

const UserHistoryComponent = ({ user }: UserListComponentProps) => {
  return (
    <div className="w-full h-[55vh] overflow-y-auto">
      {user.map((u, index) => {
        return (
          <div
            key={index}
            className="z-1 sticky w-full cursor-pointer hover:bg-black/10 duration-150 transition-normal grid grid-cols-[40px_100px_3fr_3fr_1fr_1fr_2fr] md:grid-cols-[40px_100px_3fr_1fr_1fr_1fr_2fr] gap-2 items-center border-b border-gray-200"
          >
            <div className="flex justify-center items-center border-gray-300 p-2">
              <input type="checkbox" />
            </div>
            <div className="flex justify-center items-center border-gray-300 p-2">
              {u.id}
            </div>
            <div className="flex items-center gap-4 border-gray-300 p-2">
              <div className="relative ">
                <img
                  className="w-10 h-10 rounded-full"
                  src={`${import.meta.env.VITE_BASE_URL}/${u.profilePic}`}
                  alt=""
                />{" "}
              </div>
              <p>
                {u.name} {u.surname}{" "}
              </p>
            </div>
            <div className="flex items-center border-gray-300 p-2">
              {u.username}
            </div>

            <div className="flex items-center border-gray-300 p-2 justify-center">
              {u.categories === "Manufacture" ? (
                <div className="bg-[#F59E0B] rounded-full text-white px-4 py-1 text-sm">
                  {u.categories}
                </div>
              ) : (
                <div className="bg-[#5DADE2] rounded-full text-white px-4 py-1 text-sm">
                  {u.categories}
                </div>
              )}
            </div>
            <div className="flex items-center font-semibold opacity-50 border-gray-300 p-2 text-sm">
              {u.role}
            </div>
            <div className="p-4">
              {u.action ? (
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">{u.action}</span> -{" "}
                  {new Date(u.loginAt ?? "").toLocaleString("th-TH", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              ) : (
                <div className="text-sm text-gray-500">ไม่มีข้อมูล</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default UserHistoryComponent;
