// src/utils/localStorage.ts
export const getUserIdFromStorage = (): string | null => {
  try {
    const user = localStorage.getItem("user");
    if (!user) return null;
    return JSON.parse(user)._id ?? null;
  } catch {
    return null;
  }
};
