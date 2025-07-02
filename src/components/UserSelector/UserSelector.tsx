import { useState } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import type { RecentUser } from "../features/auth/authSlice";

interface UserSelectorProps {
  users: RecentUser[];
  onSelect: (user: RecentUser) => void;
  onDelete: (userId: string) => void; // เพิ่ม
  selectedUser?: RecentUser;
}

const UserSelector = ({
  users,
  onSelect,
  onDelete,
  selectedUser,
}: UserSelectorProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        type="button"
        className="flex items-center w-full border border-gray-300 rounded-md py-4 p-2 shadow-sm justify-between"
        onClick={() => setOpen(!open)}
      >
        {selectedUser ? (
          <>
            <img
              src={`${import.meta.env.VITE_BASE_URL}/${selectedUser.avatarUrl}`}
              alt="avatar"
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="flex-1 text-left">{selectedUser.displayName}</span>
          </>
        ) : (
          <span className="text-gray-400 flex-1 text-left">เลือกผู้ใช้</span>
        )}
        <Icon icon="mdi:menu-down" width={24} height={24} />
      </button>

      {open && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg"
        >
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between p-2 cursor-pointer hover:bg-blue-100"
            >
              <div
                className="flex items-center flex-1"
                onClick={() => {
                  onSelect(user);
                  setOpen(false);
                }}
              >
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/${user.avatarUrl}`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span>{user.displayName}</span>
              </div>

              <button
                type="button"
                className="ml-2 text-[#3B82F6] hover:text-[#3B82F6]"
                onClick={(e) => {
                  e.stopPropagation(); // ป้องกันไม่ให้ trigger onSelect
                  onDelete(user.id);
                }}
                aria-label={`ลบผู้ใช้ ${user.displayName}`}
              >
                <Icon icon="stash:minus-solid" width="24" height="24" />
              </button>
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};
export default UserSelector;
