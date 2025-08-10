import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface IUserStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string) => void;
  refreshToken: string | null;
  setRefreshToken: (refreshToken: string) => void;
  userProfile: any;
  setUserProfile: (userProfile: any) => void;
  clearToken: () => void;
}

const userStorage = create<IUserStore>()(
  persist(
    (set, get) => ({
      accessToken: "",
      setAccessToken: (accessToken: string) => {
        set((state) => ({
          ...state,
          accessToken,
        }));
      },
      refreshToken: "",
      setRefreshToken: (refreshToken: string) => {
        set((state) => ({
          ...state,
          refreshToken,
        }));
      },
      userProfile: {} as any,
      setUserProfile: (userProfile: any) => {
        set((state) => ({
          ...state,
          userProfile,
        }));
      },
      clearToken: () => {
        set((state) => ({
          ...state,
          accessToken: null,
          refreshToken: null,
        }));
      },
    }),
    { name: "userStorage", storage: createJSONStorage(() => localStorage) },
  ),
);

export default userStorage;
