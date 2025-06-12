export interface UserListComponentProps {
  user: User[];
  userStatusMap: Record<string, string>;
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
}
const sortUserData = (users: User[]): User[] => {
  return [...users].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
};
const UserListComponent = ({ user, userStatusMap }: UserListComponentProps) => {
  const sortedUsers = sortUserData(user);

  return (
    <>
      {sortedUsers.map((u) => {
        const status = userStatusMap[u._id || ""] || "offline";

        return (
          <div
            key={u.id}
            className="z-1 sticky w-full cursor-pointer hover:bg-black/10 duration-150 transition-normal grid grid-cols-[40px_100px_3fr_3fr_1fr_1fr_1fr_1fr] md:grid-cols-[40px_100px_3fr_1fr_1fr_1fr_1fr_1fr] gap-2 items-center border-b border-gray-200"
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
            <div className="opacity-80 flex items-center border-gray-300 p-2">
              <div className="opacity-80 flex items-center border-gray-300 p-2">
                <span
                  className={`capitalize font-semibold text-md ${
                    status === "online"
                      ? "text-green-500"
                      : status === "active"
                      ? "text-green-500"
                      : status === "away"
                      ? "text-yellow-500"
                      : "text-gray-500"
                  }`}
                >
                  {status === "online"
                    ? "ออนไลน์"
                    : status === "active"
                    ? "ออนไลน์"
                    : status === "away"
                    ? "ไม่อยู่"
                    : "ออฟไลน์"}
                </span>
              </div>
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
              <div className="bg-[#17A2B8] flex justify-center items-center rounded-full text-white px-4 py-1 text-sm cursor-pointer">
                <p>แก้ไข</p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
export default UserListComponent;
