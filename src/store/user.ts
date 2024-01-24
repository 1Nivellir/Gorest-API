import { User } from "@/helpers/ReponseArray";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    isAuth: false,
    userId: null as number | null,
    userData: {
      id: 0,
      email: "",
      gender: "",
      name: "",
      status: "",
    },
  }),
  getters: {
    getAuth: (state) => state.isAuth,
    getId: (state) => state.userId,
  },
  actions: {
    setUserLocalStorage(data: User) {
      const encodedUserData = btoa(JSON.stringify(data));
      localStorage.setItem("UserData", encodedUserData);
    },
    setUserData(userData: User) {
      this.userData = userData;
    },
    getUserData(): object {
      return this.userData;
    },
    outUser() {
      (this.isAuth = false),
        (this.userData = {
          id: 0,
          email: "",
          gender: "",
          name: "",
          status: "",
        });
    },
    getUserId(id: number) {
      this.userId = id;
    },
    getAuthTrue() {
      this.isAuth = true;
    },
    getAuthFalse() {
      console.log("Что-то не то...");
      this.isAuth = false;
    },
  },
});
